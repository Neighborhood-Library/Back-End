const express = require('express');
const passport = require('passport');


const router = express.Router();
//Oauth Routes//////////////////////////////////////////////
// sends user to Google auth sign in
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// gets user info back after log in
router.get('/google/callback', passport.authenticate('google'),
    (req, res) => {
        console.log(req.headers);
        let reqURL = req.headers.referrer;
        reqURL = reqURL.split('.com/');
        reqURL[1] = 'dashboard';
        const newURL = reqURL.join('.com/')
    
        res.redirect(newURL);
    }
);

// logs user out and removes req.user property and session
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

// returns current user info
router.get('/current_user', (req, res) => {
    if (req.user && req.user.length > 0) {
        console.log(req.user[0].user_name + 'logged in');
        res.status(200).json({user: req.user});
    } else {
        // no user found, 204 to not have errors in client console
        res.status(204).json({ message: 'no user found '});
    }
});

/////localStrategy Routes///////////////////////////////////////////////////////////


//911//911//911
//set the res.redirect when the dashboard is ready and linked in heroku in login

//login user and send to dashboard when successful or login if not
router.post('/login', passport.authenticate('local.login'), (req, res) => {
    res.status(200).json({
        loginSuccess: true
    });
});

//register users and send to dashboard or back to form based on sucess
router.post('/register', passport.authenticate('local.register', {
//     successRedirect : '/login', 
//     failureRedirect : '/register', 
    failureFlash : true 
}), (req, res) => {
    res.status(201).json({
        registerSuccess: true
    });
});



module.exports = router;
