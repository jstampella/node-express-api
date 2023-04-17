const { handleHttpError } = require('../utils/handleError');

/**
 * Array con los roles permitidos
 * @param {*} roles
 * @returns
 */
const checkRol = (roles) => (req, res, next) => {
	try {
		const { user } = req;
		const rolesByUser = user.role;

		const checkValueRol = roles.some((roleSingle) =>
			rolesByUser.includes(roleSingle)
		);
		if (!checkValueRol) {
			handleHttpError(res, 'USER_NOT_PERMISSIONS', 403);
			return;
		}

		next();
	} catch (error) {
		handleHttpError(res, 'ERRORS_PERMISSIONS', 403);
	}
};

module.exports = checkRol;
