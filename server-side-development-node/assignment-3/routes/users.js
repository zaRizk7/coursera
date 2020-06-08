var express = require("express");
var router = express.Router();
var passport = require("passport");

var User = require("../models/users");

var authenticate = require("../authenticate");

/* GET users listing. */
router.get(
	"/",
	authenticate.verifyUser,
	authenticate.verifyAdmin,
	(req, res, next) => {
		User.find().then((users) => {
			res.statusCode = 200;
			res.setHeader("Content-Type", "application/json");
			res.json(users);
		});
	}
);

router.post("/signup", (req, res, next) => {
	User.register(
		new User({ username: req.body.username }),
		req.body.password,
		(err, user) => {
			if (err) {
				res.statusCode = 500;
				res.setHeader("Content-Type", "application/json");
				res.json({ err: err });
			} else {
				if (req.body.firstname) user.firstname = req.body.firstname;
				if (req.body.lastname) user.lastname = req.body.lastname;
				user.save((err, user) => {
					if (err) {
						res.statusCode = 500;
						res.setHeader("Content-Type", "application/json");
						res.json({ err: err });
						return;
					}
					passport.authenticate("local")(req, res, () => {
						res.statusCode = 200;
						res.setHeader("Content-Type", "application/json");
						res.json({
							success: true,
							status: "Registration Successful!",
						});
					});
				});
			}
		}
	);
});

router.post("/login", passport.authenticate("local"), (req, res) => {
	const token = authenticate.getToken({ _id: req.user._id });
	res.statusCode = 200;
	res.setHeader("Content-Type", "application/json");
	res.json({
		success: true,
		token,
		status: "You are successfully logged in!",
	});
});

module.exports = router;
