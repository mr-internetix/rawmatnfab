const express = require('express');
const router = express.Router();
const userService = require('./user.service');


// routes
router.post('/authenticate', authenticate);
router.post('/createAdmin', createAdmin)

// router.get('/us',(req,res)=>{
// })

module.exports = router;

function authenticate(req, res, next) {
    userService.authenticate(req.body).then(user =>{
        if(user.token){
            res.cookie('token',user.token).redirect('/dashboard')
        }else{
            res.json(user)
        }
    }

    )
}



function createAdmin(req,res,next){
    userService.createUser(req.body).then(respose => res.json(respose)).catch(next);
}