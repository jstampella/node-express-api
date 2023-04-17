const bcryptjs = require('bcryptjs');
/**
 * contraseña sin encriptar
 * @param {*} passwordPlain
 */
const encrypt = async (passwordPlain) => {
	const hash = await bcryptjs.hash(passwordPlain, 10);
	return hash;
};

/**
 * pasar contraseña sin encriptar
 * @param {*} passwordPlain
 * pasar contraseña encriptada
 * @param {*} hashPassword
 */
const compare = async (passwordPlain, hashPassword) => {
	return await bcryptjs.compare(passwordPlain, hashPassword);
};

module.exports = { encrypt, compare };
