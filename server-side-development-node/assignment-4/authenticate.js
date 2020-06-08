const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/users');

const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');

const config = require('./config');

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = (user) => {
	return jwt.sign(user, config.secretKey, { expiresIn: 3600 });
};

const opts = {
	jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
	secretOrKey: config.secretKey,
};

exports.jwtPassport = passport.use(
	new JWTStrategy(opts, (payload, done) => {
		console.log(`JWT payload: ${payload}`);
		User.findOne({ _id: payload._id }, (err, user) => {
			if (err) {
				return done(err, false);
			} else if (user) {
				return done(null, user);
			} else {
				return done(null, false);
			}
		});
	})
);

exports.verifyUser = passport.authenticate('jwt', { session: false });
exports.verifyAdmin = (req, res, next) => {
	if (req.user.admin) {
		next();
	} else {
		res.statusCode = 401;
		res.end('You are not authorized to perform this operation!');
	}
};
