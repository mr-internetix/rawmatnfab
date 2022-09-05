const Category = require('../models/category')
const Product = require('../models/product')

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




module.exports = getcategoryData;