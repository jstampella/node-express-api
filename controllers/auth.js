const { matchedData } = require('express-validator');
const { encrypt, compare } = require('../utils/handlePassword');
const { usersModel } = require('../models');
const { tokenSign } = require('../utils/handleJwt');
const { handleHttpError } = require('../utils/handleError');

/**
 * Este controlador es el encargado de registrar un usuario
 * @param {*} req
 * @param {*} res
 */
const registerCtrl = async (req, res) => {
	try {
		req = matchedData(req);
		const password = await encrypt(req.password);
		const body = { ...req, password };

		const dataUser = await usersModel.create(body);
		dataUser.set('password', undefined, { strict: false });

		const data = {
			token: await tokenSign(dataUser),
			user: dataUser,
		};

		res.status(201).send({ data });
	} catch (error) {
		console.log(error);
		handleHttpError(res, 'error al registrar usuario');
	}
};

/**
 * Este controlador es el encargado de loguear una persona
 * @param {*} req
 * @param {*} res
 */
const loginCtrl = async (req, res) => {
	try {
		req = matchedData(req);
		const user = await usersModel.findOne({ email: req.email });
		if (!user) {
			handleHttpError(res, 'No existe el usuario', 404);
			return;
		}

		const hashPassword = user.get('password');

		const check = await compare(req.password, hashPassword);
		if (!check) {
			handleHttpError(res, 'password invalido', 401);
			return;
		}

		user.set('password', undefined, { strict: false });
		const data = {
			token: await tokenSign(user),
			user,
		};

		res.send({ data });
	} catch (error) {
		console.log(error);
		handleHttpError(res, 'error al loguear usuario');
	}
};

module.exports = { loginCtrl, registerCtrl };
