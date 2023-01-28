const router = require("express").Router();
const getcategoryData = require("../routes/getCategoryData");

router.get("", async (req, res) => {
	let categorydata = await getcategoryData();
	res.render("material", { about: categorydata });
});

module.exports = router;
