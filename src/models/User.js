const mongoose = require('mongoose');

module.exports = mongoose.model("User", {
    username: String,
    password: String,
    date: {
        type: Date,
        default: Date.now()
    }
}, "Users");