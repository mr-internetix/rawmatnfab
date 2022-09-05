const router = require("express").Router();
const Category = require("../models/category");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const imageKit = require("imagekit");
const base64Image = require("@guntur/base64-image");
const Product = require("../models/product");

// imagekit config

var imagekit = new imageKit({
    publicKey: "public_3xDrvJ6HDKVpNODXaBqsNb26syg=",
    privateKey: "private_hcxJf6WmrVd9exlMFOtznNt4pRU=",
    urlEndpoint: "https://ik.imagekit.io/l68iueu0vc",
});

// checking if the directoty not found then adding directory

try {
    if (!fs.existsSync("./public/assets/images/categoryImages")) {
        fs.mkdirSync("./public/assets/images/categoryImages");
    }
} catch (err) {
    console.log(err);
}

// multer config

let storage = multer.diskStorage({
    destination: (req, file, cb) =>
        cb(null, "./public/assets/images/categoryImages"),
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



// category 

router.get("", async (req,res)=>{
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


    const currentCategoryData = await Category.find({"_id" : req.query.id});
    const currentCategoryProducts = await Product.find({"categoryName" : currentCategoryData[0].categoryName})
    res.render("category",{categoriesData : aboutsectionData , currentCategoryData : currentCategoryData , currentCategoryProducts : currentCategoryProducts , about : aboutsectionData} )
})

router.get("/viewAllCategory", async(req,res)=>{

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
            // console.log(categoriesData)

        });

        // console.log(aboutsectionData)
        res.render("Allproducts",{categoriesData : aboutsectionData  , about : aboutsectionData});


    // const data = await Category.find({});
    // console.log(data)
})
// add category route
router.post("/addcategory", async(req, res) => {
    

    if (req.body.categoryName) {
        let currentCategory = await Category.findOne({
            categoryName: req.body.categoryName,
        });
        if (currentCategory == null) {
            let category = new Category({
                categoryName: req.body.categoryName,
                shortDescription: req.body.shortDescription,
                itemDescription: req.body.itemDescription,
                metalComposition: req.body.metalComposition,
                dimensionStandard: req.body.dimensionStandard,
            });

            await category.save();
            res.json({ "message": "Categor Uploaded SuccessFully"  });
        } else {
            res.json({ message: "Category Already Present" });
        }
    } else {
        res.json(" category already Present");
    }
});

// add image to the category route

router.post(
    "/addcategoryImage",
    upload.array("categoryImages"),
    async(req, res) => {
        try {
            // if files exists
            if (req.files.length > 0) {
                req.files.map((image) => {
                    // console.log(image.path);
                    base64Image.encoder(path.resolve(image.path)).then((base64String) => {
                        filepath = [];
                        imagekit
                            .upload({
                                file: base64String, //required
                                fileName: image.originalname, //required
                            })
                            .then(async(response) => {
                                data = await Category.findOneAndUpdate({ categoryName: req.body.categoryName }, { $push: { categoryImages: response.url } });
                            })
                            .catch((error) => {
                                res.json(error);
                            });
                    });
                });

                res.json(" files are uploading ");
            } else {
                res.json({ message: "Please provide file" });
            }
        } catch (err) {
            res.json(err);
        }
    }
);

//get Categories

router.get("/getcategories", async(req, res) => {
    try {
        const data = await Category.find({}, {
            categoryName: 1,
            categoryImages: 1,
        });

        const all_products = await Product.find({});

        // const product

        const aboutsectionData = data.map((category) => {
            categoryName = category.categoryName;
            categoryImage = category.categoryImages[0];
            products = all_products.filter(
                (product) => product.categoryName === categoryName
            );

            return { categoryName, categoryImage, products };
        });

        res.json(aboutsectionData);
    } catch (err) {
        console.log(err);
    }
});

// Category  page route

router.get("/:name", async(req, res) => {
    try {
        if (req.params.name) {
            const category_name = req.params.name;
            data = await Category.findOne({ categoryName: category_name });
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


router.post('/deleteCategory', async (req ,res)=>{
        const id  = req.body.id
        if(!id){
            res.json({"message" : "No id Provided"})
        }
        await Category.findOneAndDelete({"_id" : id})
        res.json({"message" : " Category successfully Deleted"})
})




// get a particular category 


router.get('/categoryIs/:id', async (req , res)=>{
    try {
        if (req.params.id) {
            data = await Category.find({ _id : req.params.id });
            if (!data) {
                res.json(" No Category Found !");
            } else {
                res.json(data);
            }
        }
    } catch (err) {
        res.json(err);
    }

})




// update Category 

router.post('/updateCategory' ,upload.array('category_image'), async( req, res)=>{
    if (req.body.categoryName) {
        try {
            const categoryExists = await Category.findOne({
                categoryName: req.body.categoryName,
            });
            if (categoryExists.length !== 0) {
                const {
                    id,
                    categoryName,
                    shortDescription,
                    itemDescription,
                    metalComposition,
                    dimensionStandard,
                } = req.body;


                await Category.findOneAndUpdate({_id : id},{"categoryName" : categoryName ,  "shortDescription" : shortDescription , "itemDescription" : itemDescription, "metalComposition" : metalComposition , "dimensionStandard" : dimensionStandard }) 

                    res.json({ message: "Category Updated" });

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
                                            data = await Category.findOneAndUpdate({ _id: req.body.id }, { $push: { categoryImages: response.url } });
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
            res.json({ err });
            // console.log(err)
        }
    }


})
module.exports = router;