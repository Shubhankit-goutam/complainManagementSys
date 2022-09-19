const User = require('../models/User');
const Complain = require('../models/Complain');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");


const register = (req, res, next) => {
    var user = new User();
    user.role = req.body.role
    user.name = req.body.name;
    user.email = req.body.email;
    user.phoneno = req.body.phoneno;
    user.password = req.body.password;
    user.delete = true;
    user.jobType = req.body.jobType;

    if(req.body.role == "Admin"){
        user.created_by_Id = ""
    }else{
        user.created_by_Id = req.body.created_by_Id
    }

       User.find({email : req.body.email }, function (err, result) {
        if(result.length > 0){
            res.send({
                "message": "This email is allready registered"
            })
        }else{
            User.findOne({ _id: req.body.created_by_Id}, function (err, result) {
                if(result.role == "Admin"){
                    user.save((err, userResult) => {
                        if (!err) {
                            res.send({
                                "data": userResult,
                                "data": "successfully register And Sigin with register email & password ",
                                "status": "200"
                            })
                        } else {
                            res.send(err);
                        }
                    });
                }else{
                    res.send({
                        "message": "You can't be Add Because your role not be an admin"
                    })
                }
            });
           
        }
        });
        
  
}

const login = (req, res, next) => {
    User.findOne({
            $or: [{
                email: req.body.email
            }, {
                password: req.body.password
            }]
        })
        .then(User => {
            if ((User.email == req.body.email)&&(User.password == req.body.password)) {
                let token = jwt.sign({
                    UserId: User._id
                }, 'verySecretValue')
                res.send({
                    "message": 'login Successfull',
                    token: token
                })
            } else {
                res.send({
                    "error": "Creditional is not matched"
                })
            }
        })
}

const Deletevender = (req, res, next) => {
    User.find({
        $or: [{
            _id: req.body.id
        }]
    }, function (err, result) {
        if (result.length > 0) {
            User.findOne({ _id: req.body.created_by_Id}, function (err, admin_result) {
                if((admin_result.role == "Admin")){
                    User.deleteOne({
                        _id: req.body.id
                    }, function (err, result) {
                        console.log(result._id);
                        if (err) {
                            res.send({
                                "error": err
                            })
                        } else {
                            res.send({
                                "result": "Successfully delete "
                            })
                        }
                    });
                }else{
                    res.send({
                        "message": "You can't be Remove Because your role not be an admin"
                    })
                }
            })
            
           
        } else {
            res.send({
                "result": "Not found",
            })
        }

    });

}

const complain = (req, res, next) => {
    console.log(req.body);
    var complain = new Complain();
    complain.complain_title = req.body.complain_title
    complain.complain_disc = req.body.complain_disc;
    complain.complain_status = 1;
    complain.complain_type = req.body.complain_type;
    complain.complain_remark = "";
    complain.UserId = req.body.UserId;
    complain.empId = req.body.empId;

    complain.save((err, userResult) => {
            if (!err) {
                res.send({
                    "data": userResult,
                    "data": "your complain successfully register ",
                    "status": "200"
                })                   
            } else {
                res.send(err);
        }
    });
}

const complainList = (req, res, next) => {
    Complain.find({UserId: req.params.userId}, function (err, result) {
        res.send({
            "complain": result
        })
    });
}

const check_complain = (req, res, next) => {
    //type = 1 means open
    //type = 2 means progress
    //type = 3 means close
    //type = 0 means delete

    User.findOne({ _id: req.query.id}, function (err, result) {
        switch (result.role) {
            case "Admin":
                if(result.role == "Admin"){
                    if(req.query.type == ""){
                        Complain.find({}, function (err, result) {
                            res.send({
                                "complain": result
                            })
                        });
                    }else{
                        Complain.find({complain_status:req.query.type}, function (err, result) {
                            res.send({
                                "complain": result
                            })
                        });
                    }
                    
                }else{
                    res.send({
                        "message": "You can't be see AllComplain Because your role not be an admin"
                    })
                }
                break;
            case "Employee":
                Complain.find({$and: [{
                    empId: req.query.id
                }, {
                    complain_status: req.query.type
                }]}, function (err, result) {
                    res.send({
                        "complain": result
                    })
                });
                break;
            case "Vendor":
                Complain.find({$and: [{
                    empId: req.query.id
                }, {
                    complain_status: req.query.type
                }]}, function (err, result) {
                    res.send({
                        "complain": result
                    })
                });
            break;
           
        }
        
        
    }); 
   
}

const updateComplain = (req, res) => {
    Complain.updateOne(
      { _id: req.query.complainId },
      {
        $set: {
            complain_status: req.query.complain_status,
        },
      },
      (err, result) => {
        if (err) {
          res.send(err);
        } else {
            res.send({
                "data": result,
                "data": "your complain status successfully update  ",
                "status": "200"
            })     
        }
      }
    );
  };

const complainstatus = (req, res, next) => {
    Complain.findOne({_id: req.params.complain_id}, function (err, result) {
        User.findOne({_id:result.UserId},function(err , user_result){
            const complainObj = {
                "vendorName":user_result.name,
                "email":user_result.email,
                "phoneNumber":user_result.phoneno,
                "complain_title":result.complain_title,
                "complain_disc":result.complain_disc,
                "complain_status":result.complain_status,
                "complain_type":result.complain_type
            }
            res.send({
                "data": complainObj,
                "status": "200"
            })   
        });
        
    });
}  
 

module.exports = {
    register,
    login,
    Deletevender,
    complain,
    complainList,
    check_complain,
    updateComplain,
    complainstatus
}