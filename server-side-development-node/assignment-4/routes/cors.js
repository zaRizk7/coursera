const cors = require('cors');

const whitelist = ['http://localhost:3000', 'https://localhost:3443'];

var corsOptionsDelegate = (req, cb) => {
	var corsOptions = {
		origin: false,
	};

	console.log(req.header('Origin'));
	if (whitelist.indexOf(req.header('Origin')) !== -1) {
		corsOptions.origin = true;
	}
	cb(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOption = cors(corsOptionsDelegate);
