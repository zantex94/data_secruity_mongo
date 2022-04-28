const mongoose = require("mongoose");
// 45.4.1. Assignment Security 0.0
// if a schema dosen´t match input from the client, nothing is created on the serverside.
const userSchema = mongoose.Schema({
    firstName: {
        //1. There is no change to violate a string in that context
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        //2. there is no change to use number as type as we hash the password. impossible case.
        //   testing: type: Number,
        type: String,
        //5. required is for validating if there is a value. if not a message is prompt.
        required: true,
        //4. there is a chance to not get duplicate value by having unique values.
        unique: true
    },
    created: {
        //3. if there is something that don´t match a date the error messages tells what type the user puts in.
        // if your pug dosen´t sendt a valid date there is an error message.
        type: Date,
        default: Date.now
    }
});

userSchema.methods.getFullName = function () {
    return `Name: ${this.firstName} ${this.lastName}`;
}

userSchema.methods.getInfo = function () {
    return `${this.getFullName()}, Email: ${this.email}, Zipcode: ${this.zipcode}`;
}

userSchema.methods.getCredentials = function () {
    return `${this.email}\t${this.password}`;
}

module.exports = mongoose.model("User", userSchema, 'user');
