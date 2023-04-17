const multer = require('multer');

const storage = multer.diskStorage({
	destination: (req, file, callBack) => {
		const pathStorage = `${__dirname}/../storage`;
		callBack(null, pathStorage);
	},
	filename: (req, file, callBack) => {
		const ext = file.originalname.split('.').pop();
		const filename = `file-${Date.now()}.${ext}`;
		callBack(null, filename);
	},
});

const uploadMiddleware = multer({
	storage,
});

module.exports = uploadMiddleware;
