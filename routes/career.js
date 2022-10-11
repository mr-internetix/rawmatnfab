const router = require("express").Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const careerInfo = require("../models/career");
const getcategoryData = require("../routes/getCategoryData");

// checking if the directory no tfound then adding directory

try {
	if (!fs.existsSync("./public/assets/resume")) {
		fs.mkdirSync("./public/assets/resume");
	}
} catch (err) {
	console.log(err);
}

let storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, "./public/assets/resume"),
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

// resume and career info route

router.get("", async (req, res) => {
	let categorydata = await getcategoryData();
	res.render("career", { about: categorydata });
});

router.post("", upload.single("resume_pdf"), async (req, res) => {
	if (req.file.mimetype === "application/pdf") {
		try {
			const resume_data = await careerInfo.find({
				email: req.body.email_address,
			});
			if (resume_data.length > 0) {
				res.json({
					message:
						"your details already exists / Use another email if ypu want to post it  ",
				});
			} else {
				const {
					full_name,
					email_address,
					phone_number,
					qualification,
					address,
					position,
				} = req.body;
				const url = `${process.env.pdf}/static/assets/resume/${req.file.filename}`;
				career_info = new careerInfo({
					fullName: full_name,
					email: email_address,
					phoneNumber: phone_number,
					qualification: qualification,
					address: address,
					position: position,
					resumeUrl: url,
					date: Date(),
				});

				const response = await career_info.save();
				res.json({ message: " Your response Recorded " });
			}
		} catch (error) {
			res.json(error);
		}
	} else {
		fs.unlinkSync(req.file.path);
		res.json({ message: "only pdf supported" });
	}
});

router.post("/deleteApplication", async (req, res) => {
	const id = req.body.id;
	if (!id) {
		res.json({ message: "No id Provided" });
	}
	await careerInfo.findOneAndDelete({ _id: id });
	res.json({ message: " Application  successfully Deleted" });
});

module.exports = router;
