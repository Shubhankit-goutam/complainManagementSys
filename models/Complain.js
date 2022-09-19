const mongoose = require('mongoose');
const Schema = mongoose.Schema
var Complain = new mongoose.Schema({
        complain_title: String,
        complain_disc: String,
        complain_status:Number,
        complain_type: String,
        complain_remark:String,
        empId:String,
        create_at:{
                type:Date,
                default: Date.now,
            },
        UserId : {type : Schema.Types.ObjectId, ref : 'User'}
});

module.exports = mongoose.model('Complain', Complain) //632756d05eac69a44b5cfecc