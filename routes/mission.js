const router = require('express').Router();
const mission = require('../models/mission')



router.get('/getMission',async (req , res)=>{
    const response = await mission.find({},{mission : 1});
    res.json(response)


})

router.get('/getVision',async (req , res)=>{

    const response = await mission.find({},{vision : 1});
    res.json(response)
    
    
})

router.get('/getGoal',async (req , res)=>{
    const response  = await mission.find({},{goal : 1})
    res.json(response)
    
})




router.post('/setMission', async (req , res)=>{

    await mission.findOneAndUpdate({mission : req.body.mission})
    res.json({"message" : "Mission updated "})


})


router.post('/setVision',async (req , res)=>{

    
    await mission.findOneAndUpdate({vision : req.body.vision})
    res.json({"message" : "Vision updated "})


})




router.post('/setGoal',async (req , res)=>{

    await mission.findOneAndUpdate({goal : req.body.goal})
    res.json({"message" : "Goal updated "})

})










module.exports  = router ;