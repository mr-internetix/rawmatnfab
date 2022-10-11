// dotenv config
require("dotenv").config(".env");
const path = require("path");
const jwtverify = require("jsonwebtoken");
const config = require("./config.json");

// express imports
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("./routes/_helpers/jwt");
const errorHandler = require("./routes/_helpers/error-handler");
const connect_database = require("./config/database");
const cookieParser = require("cookie-parser");
var compress = require("compression");
const app = express();

// body-parse for parsing body into json format and cors middle ware

app.use(compress());
// app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(cookieParser());

// api route for authentication

app.use(cors());

// database import
connect_database();

// setting up static
app.use("/static", express.static("public"));
app.set("view engine", "ejs");

// setting up templating engines
app.set("/views", path.resolve(__dirname, "/views"));

// routes

app.use("/", require("./routes/index"));
app.use("/dashboard", require("./routes/pages"));

// login route
app.get("/login", (req, res) => {
	res.render("sign-in");
	// jwtverify.verify(req.cookies.token , config.secret)
});

app.get("/logout", (req, res) => {
	res.clearCookie("token").redirect("/");
});

// upload banner tested
app.use("/uploadbanner", require("./routes/uploadBanner"));

//contact us route
app.use("/contactus", require("./routes/contactUs"));

// Category and Products

app.use("/category", require("./routes/Category"));

app.use("/product", require("./routes/Product"));

// career route

app.use("/career", require("./routes/career"));

// testimonial

app.use("/testimonial", require("./routes/testimonial"));

// about

app.use("/about", require("./routes/about"));

app.use("/mission", require("./routes/mission"));
// material page
app.use("/material", require("./routes/material"));

// brochure
app.get("/brochure", (req, res) => {
	res.render("brochure");
});

// use JWT auth to secure the api
app.use(jwt());

// api routes
app.use("/users", require("./routes/users/users.controller"));

// global error handler
app.use(errorHandler);

app.listen(process.env.PORT, () => {
	console.log(
		`server is running on : ${process.env.mainurl}:${process.env.PORT}`
	);
});
