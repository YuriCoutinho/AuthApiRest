const { Schema, model } = require('mongoose');

const userSchema = new Schema({ 
    name: {
        type: String,
        require: true,
        lowercase: true,
    }, 
    email: {
        type: String,
        require: true,
        lowercase: true,
    }, 
    password: {
        type: String,
        require: true
    }
});

const User = model('User', userSchema);

module.exports = User;