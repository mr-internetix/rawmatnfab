const contactUs = require("../models/contactUs");
const router = require("express").Router();
const config = require("../config.json");
const jwtverify = require("jsonwebtoken");

const getcategoryData = require("../routes/getCategoryData");

router.get("", async (req, res) => {
	let categorydata = await getcategoryData();
	res.render("contact", { about: categorydata });
});

router.post("/", async (req, res) => {
	if (!req.body.mobileNumber) {
		res.json({
			message: "something went wrong Please Provide proper details",
		});
	} else {
		const mobilenumber = await contactUs.findOne({
			mobileNumber: req.body.mobileNumber,
		});
		if (mobilenumber) {
			res.json({ message: "Record Already Exists" });
		} else {
			contactus = new contactUs({
				name: req.body.name,
				mobileNumber: req.body.mobileNumber,
				emailId: req.body.email,
				subject: req.body.subject,
				message: req.body.message,
				date: new Date().toLocaleDateString("en-GB"),
			});

			response = await contactus.save();
			res.json({
				message:
					"Thank you for contacting us your form is saved we will get back to you soon ",
			});
		}
	}
});

router.post("/deleteEnquiry", async (req, res) => {
	jwtverify.verify(req.cookies.token, config.secret);

	const id = req.body.id;
	if (!id) {
		res.json({ message: "something went wrong !" });
	}
	try {
		let response = await contactUs.findOneAndDelete({ _id: id });
		res.json({ message: " enquiry deleted successfully " });
	} catch (err) {
		res.json(err);
	}
});

module.exports = router;
