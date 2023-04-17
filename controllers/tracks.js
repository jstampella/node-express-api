const { matchedData } = require('express-validator');
const { tracksModel } = require('../models');
const { handleHttpError } = require('../utils/handleError');

/**
 * Obtener lista de la base de datos
 * @param {*} req
 * @param {*} res
 */
const getItems = async (req, res) => {
	try {
		const user = req.user;
		const data = await tracksModel.findAllData({});
		res.send({ data, user });
	} catch (error) {
		handleHttpError(res, 'Error en get items');
	}
};

/**
 * Obtener un detalle
 * @param {*} req
 * @param {*} res
 */
const getItem = async (req, res) => {
	try {
		req = matchedData(req);
		const { id } = req;
		const data = await tracksModel.findOneData(id);
		res.send({ data });
	} catch (error) {
		handleHttpError(res, 'Error get item');
	}
};

/**
 * Crear un registro
 * @param {*} req
 * @param {*} res
 */
const createItem = async (req, res) => {
	try {
		const body = matchedData(req);
		const data = await tracksModel.create(body);
		res.status(201).send({ data });
	} catch (error) {
		handleHttpError(res, 'Error creando items');
	}
};

/**
 * Actualizar un registro
 * @param {*} req
 * @param {*} res
 */
const updateItem = async (req, res) => {
	try {
		const { id, ...body } = matchedData(req);
		const data = await tracksModel.findOneAndUpdate(id, body);
		res.send({ data });
	} catch (error) {
		handleHttpError(res, 'Error actualizando item');
	}
};

/**
 * Eliminar un registro
 * @param {*} req
 * @param {*} res
 */
const deleteItem = async (req, res) => {
	try {
		req = matchedData(req);
		const { id } = req;
		const deleteResponse = await tracksModel.delete({ _id: id });
		const data = {
			deleted: deleteResponse.matchedCount,
		};
		res.send({ data });
	} catch (error) {
		handleHttpError(res, 'Error al eliminar item');
	}
};

module.exports = { getItems, getItem, createItem, updateItem, deleteItem };
