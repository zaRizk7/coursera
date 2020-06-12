const { Router } = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const multer = require('multer');

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'public/images');
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname);
	},
});

const imageFilter = (req, file, cb) => {
	if (!file.originalname.match(/\.(jpg|png|jpeg|gif)$/)) {
		return cb(new Error('Only image files allowed!'));
	}
	cb(null, true);
};

const upload = multer({ storage, fileFilter: imageFilter });

const uploadRouter = Router();

uploadRouter
	.route('/')
	.get(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
		res.statusCode = 403;
		res.end('GET operation not supported on /imageUpload');
	})
	.post(
		authenticate.verifyUser,
		authenticate.verifyAdmin,
		upload.single('imageFile'),
		(req, res) => {
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			res.json(req.file);
		}
	)
	.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
		res.statusCode = 403;
		res.end('PUT operation not supported on /imageUpload');
	})
	.delete(
		authenticate.verifyUser,
		authenticate.verifyAdmin,
		(req, res, next) => {
			res.statusCode = 403;
			res.end('DELETE operation not supported on /imageUpload');
		}
	);

module.exports = uploadRouter;
