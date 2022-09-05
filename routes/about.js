const router = require('express').Router();
const about = require('../models/about');
const getcategoryData = require("../routes/getCategoryData")
const mission = require("../models/mission")




router.get('',async (req,res)=>{
    const missionData  = await mission.find({})
    const aboutData   = await about.find({})
    // console.log(aboutData , missionData)
    let categorydata = await getcategoryData();
    res.render('about',{ about: categorydata , missionData : missionData , aboutData: aboutData})
})

router.get('/getAbout',async (req, res)=>{
    try{
        
        const aboutData = await about.find({});
        res.json({aboutData})
    }catch{(err) => res.json(err)}
})




router.post('/setAbout',async(req,res)=>{
    try{
        // console.log(req.body.about)
        await about.findOneAndUpdate({about : req.body.about})
        res.json({"message" : "About updated "})

    }catch{(err) => res.json(err)}
})














module.exports  = router ;