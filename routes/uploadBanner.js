const router = require("express").Router();
const carouselImage = require("../models/carouselImage");
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

// checking if the directory not found then adding directory

try {
    if (!fs.existsSync("./public/assets/images/carouselImage")) {
        fs.mkdirSync("./public/assets/images/carouselImage");
    }
} catch (err) {
    console.log(err);
}

let storage = multer.diskStorage({
    destination: (req, file, cb) =>
        cb(null, "./public/assets/images/carouselImage"),
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


//post request from here

router.post("/", upload.single("uploaded_file"), async(req, res) => {
    if (req.file) {
        base64Image.encoder(path.resolve(req.file.path)).then((base64String) => {
            filepath = [];
            imagekit
                .upload({
                    file: base64String, //required
                    fileName: req.file.originalname, //required
                })
                .then((response) => {
                    const carouselimage = new carouselImage({
                        imageurl: response.url,
                    });
                    return carouselimage;
                })
                .then((data) => {
                    data.save()
                    res.json({ message: `Banner Uploaded Sucessfully` });
                })
                .catch((error) => {
                    console.log(error);
                });
        });
    } else {
        res.json({ "message": " Something went Wrong ! please provide file" })
    }

});

    

router.post('/deleteBanner',async (req, res)=>{

    const id = req.body.id;
    if(!id){
        res.json({'message' : "something went wrong !"})
        
    }
    try{
        let response = await carouselImage.findOneAndDelete({"_id" : id})
        res.json({"message" : " Banner Image deleted successfully "})

    }
    catch(err){
        res.json(err)
    }
})

module.exports = router;