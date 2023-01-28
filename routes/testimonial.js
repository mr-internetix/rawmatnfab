const router = require("express").Router();
const testimonials = require("../models/testimonial");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const {
    v4: uuidv4
} = require("uuid");
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
    if (!fs.existsSync("./public/assets/images/testimonialImages")) {
        fs.mkdirSync("./public/assets/images/testimonialImages");
    }
} catch (err) {
    console.log(err);
}

let storage = multer.diskStorage({
    destination: (req, file, cb) =>
        cb(null, "./public/assets/images/testimonialImages"),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});

const upload = multer({
    storage,
    limits: {
        fileSize: 100000 * 100
    },
});

router.post(
    "/addTestimonial",
    upload.single("testimonial_image"),
    async (req, res) => {
        if (req.body.name) {
            const { name , position , text }  = req.body;
            const id = uuidv4();

            const currentTestimonial = new testimonials({
                "id" : id ,
                "name" : name ,
                "position" : position ,
                "text" : text  

            })
            await currentTestimonial.save()
            if (req.file) {
                  base64Image
                    .encoder(path.resolve(req.file.path))
                    .then((base64String) => {
                      imagekit
                        .upload({
                          file: base64String,
                          fileName: req.file.originalname,
                        })
                        .then(async (response) => {
                          data = await testimonials.findOneAndUpdate(
                            { "id": id },
                            { $push: { photoUrl: response.url } }
                          );
                        })
                        .catch((error) => {
                          console.log(error);
                        });
                    });
            
              }

              res.json({"message" : "testimonial Saved"})
        }
    }
    

);

router.post("/deleteTestimonial", async (req, res) => {
    const id  = req.body.id
    if(!id){
        res.json({"message" : "No id Provided"})
    }
    await testimonials.findOneAndDelete({"_id" : id})
    res.json({"message" : " testimonial successfully Deleted"})
});



router.get("/getTestimonials",async(req , res)=>{
    const response = await testimonials.find({})
    res.json(response)
})

module.exports = router;