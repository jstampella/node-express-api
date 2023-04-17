const { validationResult: validate } = require('express-validator');

const validateResults = (req, res, next) => {
	const errors = validate(req);

	if (errors.isEmpty()) {
		return next();
	}

	const err = {
		errors: errors.array(),
	};

	return res.status(403).json(err);
};

module.exports = { validateResults };
