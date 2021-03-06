"use strict";
const bcrypt = require('bcryptjs');                         // added for hashing
const mongoose = require('mongoose');                       // added for mongo
const User = require("./User");

const monConnect = async function () {
    const dbServer = "0.0.0.0";
    const dbName = "testuser1";
    const constr = `mongodb://${dbServer}:27017/${dbName}`;
    const conparam = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    };
    await mongoose.connect(constr, conparam);
    return mongoose.connection;
};

exports.getUsers = async function (query, sort) {
    const db = await monConnect();
    try {
        let cs = await User.find(query, sort);
        db.close();
        return cs;
    } catch (e) {
        console.error(e);
    }
};

exports.saveUser = async function (req) {
    const db = await monConnect();
    const saltTurns = 10;
    let user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, saltTurns),
        created: req.body.created,
    });
    try {
        await user.save(function(err, saved) {
            //if there is an error it dosen´t set the row into mongo.
            if(err){
                console.log(err);
                db.close();
                return err;
            }
            db.close();
            return saved;
        });
    } catch(e) {
        console.error(e);
    }
};

exports.verifyUser = async function (req) {
    const db = await monConnect();
    let check = { email: req.body.email };
    let u = await this.getUsers(check);
    if (u.length === 1) {
        let success = await bcrypt.compare(req.body.password, u[0].password);
        if (success) {
            req.session.authenticated = true;       // set session vars
            req.session.user = u[0].firstName;      // set session vars
        } else {
            req.session.destroy();                  // same as logout
        }
        return success;
    } else {
        req.session.destroy();
        return false;
    }
};
