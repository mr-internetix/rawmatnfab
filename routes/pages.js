
const router = require("express").Router()
const config = require('../config.json');
const jwtverify = require("jsonwebtoken")
const ContactUs = require('../models/contactUs')
const Category  = require('../models/category')
const Products = require('../models/product')
const visits = require('../models/visitors')
const carouselImage = require("../models/carouselImage")
const testimonial = require("../models/testimonial")
const career = require("../models/career");
const about = require("../models/about");
const mission = require("../models/mission");



router.get('/',async(req , res ,next )=>{
    try{
        jwtverify.verify(req.cookies.token , config.secret)
        let  enquiry = await (ContactUs.find({}).sort({date : -1}))
        if (enquiry.length > 10){
            enquiry = enquiry.slice(0, 10)            
        }


        const totalCategory = (await Category.find({})).length
        const totalProducts = (await Products.find({})).length
        const totalEnquiry = enquiry.length
        const totalVisits = (await visits.find({'_id' : '6307014a038b2f6235b2b120'},{counter : 1}));


        res.render('pages/dashboard',{enquiry : enquiry , visit : totalVisits[0].counter ,  totalcategory : totalCategory , totalproducts: totalProducts , totalenquiry : totalEnquiry})
    }catch( error) {
        res.redirect('/')
    }
})



router.get('/editCategory/:id', async (req , res)=>{
    try{

        const currentCategory = await Category.find({_id : req.params.id});
        res.render('pages/editCategory',{currentCategory : currentCategory})

    }catch{err => res.json(err)}
})



router.get('/editProduct/:id', async (req , res)=>{
    try{

        const currentProduct = await Products.find({_id : req.params.id});
        const categories = await  Category.find({}, {categoryName : 1});
        res.render('pages/editProduct',{currentProduct : currentProduct , categories : categories})

    }catch{err => res.json(err)}
})



router.get('/:pageName',async (req , res )=>{

    if(req.cookies.token){
        jwtverify.verify(req.cookies.token , config.secret)
        if(req.params.pageName == 'manageCertificates') {
            res.render('pages/manageCertificates')

        }
        if(req.params.pageName == 'manageInquiry') {
            let  enquiry = await (ContactUs.find({}).sort({date : -1}))
            res.render('pages/manageInquiry' ,{enquiry : enquiry })
        }

        if(req.params.pageName == 'manageCategory') {
            categories = await (Category.find({}))
            res.render('pages/manageCategory', {categories : categories})

        }

        if(req.params.pageName == 'manageProduct') {
            products = await Products.find({})
            category = await Category.find({},{categoryName : 1})
            res.render('pages/manageProduct',{products : products  , category : category })
        }
        if(req.params.pageName == 'editTestimonial'){
            res.render('pages/editTestimonial')

        }
        if(req.params.pageName == 'manageAbout'){
            const aboutSection = await about.find({})
            res.render('pages/manageAbout',{aboutSection : aboutSection})

        }

        if(req.params.pageName == 'manageApplication'){
            const careerdetails  = await career.find({}).sort({date : -1})
            res.render('pages/manageApplication', {careerdetails})
        }


        if(req.params.pageName == 'manageMission'){
            const missionData = await mission.find({});
            res.render('pages/manageMission',{missionData : missionData})
            
        }

        if(req.params.pageName == 'manageSlider'){
            const carouselimages  = await carouselImage.find({}); 
            res.render('pages/manageSlider', {carouselimages : carouselimages})
            
        }

        if(req.params.pageName == 'manageTestimonial'){
            const testimonials = await testimonial.find({});
            res.render('pages/manageTestimonial',{ testimonials : testimonials})
        }

    }else{
        res.json({"message" : "please login before accessing the routes"})
    }

})





module.exports = router;