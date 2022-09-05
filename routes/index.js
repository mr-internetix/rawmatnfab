const router = require('express').Router()
const carousalimage = require('../models/carouselImage')
const Category = require('../models/category')
const Product = require('../models/product')
const visitors = require('../models/visitors')


router.get('', async(req, res) => {
    let data = await carousalimage.find({});
    let categorydata = await getcategoryData();
    urls = data.map(data => data.imageurl);
    res.render('index.ejs', { urls: urls , about: categorydata});
    await  visitors.findOneAndUpdate({'_id' : '6307014a038b2f6235b2b120'},{$inc: {counter: 1}},{new:true})
});




// helper function 

async function getcategoryData(){
    try {
        const data = await Category.find({}, {
            _id : 1,
            categoryName: 1,
            categoryImages: 1,
        });
    
        const all_products = await Product.find({});
    
        // const product
    
        const aboutsectionData = data.map((category) => {
            categoryId = category._id
            categoryName = category.categoryName;
            categoryImage = category.categoryImages[0];
            products = all_products.filter(
                (product) => product.categoryName === categoryName
 
            );
    
            return { categoryName, categoryImage, products , categoryId };
        });

        return aboutsectionData
    }catch(err){
        console.log(err)
    }
}    





// other pages routes 


router.get('/industries',(req,res)=>{
    res.render('industries')
})

module.exports = router;