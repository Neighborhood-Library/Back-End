const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const db = require('../database/dbConfig.js');

//imports the local strategy file and makes it available in the app throuth this import thus running in index.js through this files import,
//if this causes issues we may need to require them both there.
require('./passportLocal.js');

//takes the user from the done call in the passport.use callback, and sets the session to rember them  by the second parameter in done
//passport stores the user[0].user_credential on req.passport
passport.serializeUser((user, done) => {
    console.log('serializeUser', user);
    
    done(null, user[0].id);
});

//takes the user creds from serializeuser and makes a request to our database and calls done with the user info.  Passport then
//stores the user info on req.user, and we now have access to the user profile
passport.deserializeUser( async (id, done) => { 
    const User = await db('users').where({id: id});
    
    console.log('id deserialize', id);
    
    if (User) {
        done(null, User);
    } else {
        done(null, null);
    }
});

//the following implements googleStrategy for auth, and in the callback holds the logic to register new users, 
//and login users if they are already registered
passport.use(
    new GoogleStrategy({
        clientID: process.env.googleClientID,
        clientSecret: process.env.googleClientSecret,
        callbackURL: '/auth/google/callback',
        proxy: true
    }, async (accessToken, refreshToken, profile, done) => {   
        let user = await db('users').where({user_credential: profile.id});
        
        console.log('profile', profile);
        console.log('user', user);
    
        if (user.length > 0) {
            return done(null, user);
        }
     
        let newUser = await addNewUser(profile);
      
        done(null, newUser);
}));

async function addNewUser(p) {
    let newUser = await db('users').insert({first_name: p.name.givenName, last_name: p.name.familyName, user_name: p.emails[0].value, user_email: p.emails[0].value, user_identity: 'google', user_credential: p.id});
    return newUser
}
