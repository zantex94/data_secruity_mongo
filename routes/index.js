const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {            // root
    let loggedin = req.session.authenticated ? req.session.authenticated : false;
    let who = req.session.user ? req.session.user : ''; 
    res.render('index', {                       // find the view 'index'
        title: 'nodeAuthDemo Home',             // input data to 'index'
        loggedin: loggedin,
        who: who
    });
});

module.exports = router;
