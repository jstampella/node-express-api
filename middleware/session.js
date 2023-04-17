const { usersModel } = require('../models');
const { handleHttpError } = require('../utils/handleError');
const { verifyToken } = require('../utils/handleJwt');
const getProperties = require('../utils/handlePropertiesEngine');

const propertiesKey = getProperties();

const authMiddleware = async (req, res, next) => {
	try {
		if (!req.headers.authorization) {
			handleHttpError(res, 'NOT_TOKEN', 401);
			return;
		}

		const token = req.headers.authorization.split(' ').pop();
		const dataToken = await verifyToken(token);
		if (!dataToken) {
			handleHttpError(res, 'NOT_PAYLOAD_DATA', 401);
			return;
		}

		const query = {
			[propertiesKey.id]: dataToken[propertiesKey.id],
		};
		/**
		 * Se agrega una propiedad a la peticion
		 */
		const user = await usersModel.findOne(query);
		if (!user) {
			handleHttpError(res, 'ERROR_IN_PAYLOAD', 401);
			return;
		}
		req.user = user;

		next();
	} catch (error) {
		console.log(error);
		handleHttpError(res, 'NOT_SESSION', 401);
	}
};

module.exports = authMiddleware;
