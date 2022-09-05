const router = require('express').Router();
const about = require('../models/about');



router.get('',(req,res)=>{
    res.render('about')
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