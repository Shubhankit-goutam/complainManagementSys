const mongoose = require('mongoose');
var User = new mongoose.Schema({
    name: {
        type: String,
    },
    role:{
        type:String
    },
    email: {
        type: String,
    },
    phoneno: {
        type: String,
    },
    password: {
        type: String,
    },
    delete: {
        type: Boolean
    },
    create_at:{
        type:Date,
        default: Date.now,
    },
    jobType:{
        type:String
    },
    created_by_Id:{
        type:String
    }
    
});


module.exports = mongoose.model('User', User)