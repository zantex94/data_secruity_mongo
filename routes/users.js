const express = require('express');
const router = express.Router();
const userHandler = require('../models/handleUsers.js');

// urls relative to /users, ie /users/register, /users/login, etc
router.get('/register', function(req, res) {    // display register route
    res.render('register', {                    // display register form view
        title: 'nodeAuthDemo Register User'     // input data to view
    });
});
router.post('/register', async function(req, res) {   // new user post route
    let user = await userHandler.saveUser(req);
    res.redirect('/');                   // skip the receipt, return to fp
});

router.get('/login', function(req, res) {       // display register route
    res.render('login', {                       // display register form view
        title: 'nodeAuthDemo User Login',       // input data to view
        loginerr: false
    });
});
router.post('/login', async function(req, res) {// new user post route
    let rc = await userHandler.verifyUser(req); // verify credentials
    if (rc) {
        res.redirect('/');
    } else {
        res.render('login', {                   // find the view 'login'
            title: 'nodeAuthDemo User Login',   // input data to 'login'
            loggedin: false,
            loginerr: true
        });
    }
});
router.get('/logout', async function(req, res) {      // logout
    await req.session.destroy();
    res.redirect('/');
});

router.get('/inject', function(req, res) {
    let loggedin = req.session.authenticated ? req.session.authenticated : false;
    let who = req.session.user ? req.session.user : ''; 
    res.render('inject', {
        title: 'Inject',
        loggedin: loggedin,
        who: who
    });
});
router.post('/inject', async function(req, res) {
    let uid = { email: req.body.email };
    console.log(uid);
    let rc = await userHandler.getUsers(uid); 
    if (rc) {
        res.render('injected', {                   
            title: 'nodeAuthDemo Inject Test',   
            who: rc
        });
    } else {
        res.send('no');
    }
});

module.exports = router;
