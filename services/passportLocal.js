const passport = require('passport');
const LocalStrategy = require('passport-local');
const db = require('../database/dbConfig.js');
const bcrypt = require('bcryptjs');

//takes the user creds from serializeuser and makes a request to our database and calls done with the user info.  Passport then
//stores the user info on req.user, and we now have access to the user profile    
passport.deserializeUser( async (id, done) => {  
  const User = await db('users').where({id: id});
  
  if (User) {
    done(null, User)
  }
});

//strategy for login named local.login tied to /login route
//can use req.flash via connect-flash, to flash messages 
//verify callback expects a username and password from req.body programmed in there by passport
//renamed the username to look for user_name... and passed req into callback in the object before the verify callback
//req MUST BE first parameter in the verify callback
//logs in user and passes into serialize function

passport.use('local.login', new LocalStrategy({
  usernameField: 'user_name',
  passwordField: 'user_credential',
  passReqToCallback: true,
},
  async function(req, username, password, done) {
    let user = await db('users').where({user_name: username});
      
    if (user !== [] && await bcrypt.compare(password, user[0].user_credential)) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  }
));

//using named strategy to reg and headers to add properties to database, but only user_name and user_credential to be used in auth
//hashes password, and pulls other creds from req.body sent from frontend to set new user in db and thus passes user into serialize
passport.use('local.register', new LocalStrategy({
  usernameField: 'user_name',
  passwordField: 'user_credential',//how is this pulling these out of the user fields?? see https://github.com/jaredhanson/passport-local/blob/master/lib/strategy.js line 71 and 72 linked to line 49 and 50 ie coming from req.body, programmed in there by Jared himself
  passReqToCallback: true,
},
 async function(req, username, password, done) {
  console.log('registering user');

    const user = await db('users').where({user_name: username}); 
      
      
    if (user.length > 0) {
      console.log('username taken');
      return done(null, false, req.flash('registerMessage', 'username is already taken'));
    } else {
      console.log(req.body);
      const { first_name, last_name, user_email } = req.body;
      const hash = bcrypt.hashSync(password, 10);
      const cred = hash;
      const newUser = await db('users').insert(
        {first_name, last_name, user_name: username, user_email, user_identity: 'muoVivlio', user_credential: cred})
        .then(async () => {
          console.log('returning new user');
          return await db('users').where({user_name: username});
        })
        .catch(err => {
          console.log(err, 'passportLocal-70');
        });
        
      return done(null, newUser);  
    }
    
  }
));





  



 