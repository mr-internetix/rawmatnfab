const router = require("express").Router();
const Category = require("../models/category");
const { v4: uuidv4 } = require("uuid");
const Product = require("../models/product");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const imageKit = require("imagekit");
const base64Image = require("@guntur/base64-image");

// imagekit config

var imagekit = new imageKit({
    publicKey: "public_3xDrvJ6HDKVpNODXaBqsNb26syg=",
    privateKey: "private_hcxJf6WmrVd9exlMFOtznNt4pRU=",
    urlEndpoint: "https://ik.imagekit.io/l68iueu0vc",
});

// checking if the directoty not found then adding directory

try {
    if (!fs.existsSync("./public/assets/images/productImages")) {
        fs.mkdirSync("./public/assets/images/productImages");
    }
} catch (err) {
    console.log(err);
}

// multer config

let storage = multer.diskStorage({
    destination: (req, file, cb) =>
        cb(null, "./public/assets/images/productImages"),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 100000 * 100 },
});

// adds products to th database

router.post("/addproduct", upload.array("product_image"), async(req, res) => {
    if (req.body.categoryName) {
        try {
            const categoryExists = await Category.findOne({
                categoryName: req.body.categoryName,
            });
            if (categoryExists.length !== 0) {
                const {
                    categoryName,
                    productName,
                    shortDescription,
                    productDescription,
                    metalDescription,
                    dimensionComposition,
                } = req.body;
                const product = await Product.find({
                    productName: productName,
                    categoryName: categoryName,
                });
                const productId = uuidv4();
                if (product.length === 0) {
                    const current_product = new Product({
                        categoryName: categoryName,
                        productId: productId,
                        productName: productName,
                        shortDescription: shortDescription,
                        metalDescription: metalDescription,
                        dimensionComposition: dimensionComposition,
                        productDescription: productDescription,
                    });
                    const response = await current_product.save();
                    res.json({ message: "product added" });

                    // handling files
                    if (req.files.length > 0) {
                        req.files.map((image) => {
                            base64Image
                                .encoder(path.resolve(image.path))
                                .then((base64String) => {
                                    imagekit
                                        .upload({
                                            file: base64String,
                                            fileName: image.originalname,
                                        })
                                        .then(async(response) => {
                                            data = await Product.findOneAndUpdate({ productId: productId }, { $push: { imageUrl: response.url } });
                                        })
                                        .catch((error) => {
                                            console.log(error);
                                        });
                                });
                        });
                    }
                } else {
                    res.json({ message: "product already Present !" });
                }
            } else {
                res.json({ message: " Category Do not exist" });
            }
        } catch (err) {
            res.json({ err, message: " category not found" });
        }
    }
});

// get all the products
router.get("/getproducts", async(req, res) => {
    try {
        const response = await Product.find({});
        // let products = response.map(product => product.products)

        res.json(response);
    } catch (err) {
        res.json({ messeger: err });
    }
});

// product page

router.get("", async(req, res) => {
    product_id = req.query.id;
    category_name = req.query.category;
    if (product_id && category_name) {
        const response = await Category.find({ categoryName: category_name });
        if (response.length !== 0) {
            let products = await Product.find({
                categoryName: category_name,
                productId: product_id,
            });
            
            if (products.length === 0) {
                return res.json({ message: " no matched products found " });
            }


            const data = await Category.find({}, {
                categoryName: 1,
                categoryImages: 1,
            });
        
            const all_products = await Product.find({});
        
            // const product
        
            const aboutsectionData = data.map((category) => {
                categoryName = category.categoryName;
                categoryId  = category._id;
                categoryDesc = category.shortDescription;
                categoryImage = category.categoryImages[0];
                products = all_products.filter(
                    (product) => product.categoryName === categoryName
        
                );
        
                return { categoryName,categoryId , categoryDesc,categoryImage, products };
        
            });
        
        
            const currentProduct = await Product.find({"productId" : product_id , "categoryName" : category_name });
            const currentCategoryProducts = await Product.find({"categoryName" : category_name})
            res.render("product",{categoriesData : aboutsectionData , currentCategoryProducts : currentCategoryProducts , currentProduct : currentProduct , about : aboutsectionData })
        } else {
            res.json({ message: " Category Not found !" });
        }
    }
});



router.post('/deleteProduct', async (req ,res)=>{
    const id  = req.body.id
    if(!id){
        res.json({"message" : "No id Provided"})
    }
    await Product.findOneAndDelete({"_id" : id})
    res.json({"message" : " Category successfully Deleted"})
})



router.get('/productIs/:id',async (req, res)=>{
    try {
        if (req.params.id) {
            data = await Product.find({ _id : req.params.id });
            if (!data) {
                res.json(" No Category Found !");
            } else {
                res.json(data);
            }
        }
    } catch (err) {
        res.json(err);
    }
});




// update product 

router.post('/updateProduct' ,upload.array('product_image'), async( req, res)=>{

    if (req.body.id) {
        try {
            const categoryExists = await Product.findOne({
                _id : req.body.id
            });
            if (categoryExists.length !== 0) {
                const {
                    id,
                    categoryName,
                    productName,
                    shortDescription,
                    productDescription,
                    metalDescription,
                    dimensionComposition,
                } = req.body;


                await Product.findOneAndUpdate({_id : id},{"categoryName" : categoryName , "productName": productName, "shortDescription" : shortDescription , "productDescription" : productDescription, "metalDescription" : metalDescription , "dimensionComposition" : dimensionComposition }) 

                    res.json({ message: "Product Updated" });

                    // handling files
                    if (req.files.length > 0) {
                        req.files.map((image) => {
                            base64Image
                                .encoder(path.resolve(image.path))
                                .then((base64String) => {
                                    imagekit
                                        .upload({
                                            file: base64String,
                                            fileName: image.originalname,
                                        })
                                        .then(async(response) => {
                                            data = await Product.findOneAndUpdate({ _id: id }, { $push: { imageUrl: response.url } });
                                        })
                                        .catch((error) => {
                                            console.log(error);
                                        });
                                });
                        });
                    }
            } else {
                res.json({ message: " Do not exist" });
            }
        } catch (err) {
            // res.json({ err });
            console.log(err)
        }
    }


})

module.exports = router;