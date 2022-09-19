const express = require('express');
const router = express.Router()

const AuthController = require('../Controllers/AuthController');


router.post('/register', AuthController.register)
router.post('/login', AuthController.login)
router.post('/delete', AuthController.Deletevender)
router.post('/complain', AuthController.complain)
router.get('/getcomplain/:userId', AuthController.complainList)
router.get('/check_complain/', AuthController.check_complain)
router.get('/updateComplain/', AuthController.updateComplain)
router.get('/complainstatus/:complain_id', AuthController.complainstatus)



// router.post('/deleteFriend', AuthController.deleteFriend)
// router.post('/AddPost', AuthController.addPost)
// router.post('/deletePost', AuthController.deletePost)
// router.get('/Friendlist', AuthController.Friendlist)
// router.post('/userProfile', AuthController.userProfile)
module.exports = router;



