const { matchedData } = require('express-validator');
const { storageModel } = require('../models');
const { handleHttpError } = require('../utils/handleError');
const fs = require('fs');

const public_url = `${process.env.PUBLIC_URL}:${process.env.PORT}`;
const MEDIA_PATH = `${__dirname}/../storage`;

/**
 * Obtener lista de la base de datos
 * @param {*} req
 * @param {*} res
 */
const getItems = async (req, res) => {
	try {
		const data = await storageModel.find({});
		res.send({ data });
	} catch (error) {
		handleHttpError(res, 'Error al obtener items');
	}
};

/**
 * Obtener un detalle
 * @param {*} req
 * @param {*} res
 */
const getItem = async (req, res) => {
	try {
		const { id } = matchedData(req);
		const data = await storageModel.findById(id);
		res.send({ data });
	} catch (error) {
		handleHttpError(res, 'Error al obtener detalle item');
	}
};

/**
 * Crear un registro
 * @param {*} req
 * @param {*} res
 */
const createItem = async (req, res) => {
	try {
		const { body, file } = req;
		const fileData = {
			filename: file.filename,
			url: `${public_url}/storage/${file.filename}`,
		};
		const data = await storageModel.create(fileData);
		res.status(201).send({ data });
	} catch (error) {
		handleHttpError(res, 'Error al crear item');
	}
};

/**
 * Eliminar un registro
 * @param {*} req
 * @param {*} res
 */
const deleteItem = async (req, res) => {
	try {
		const { id } = matchedData(req);
		const dataFile = await storageModel.findById(id);
		if (!dataFile) return handleHttpError(res, 'no existe ese id');
		const { filename } = dataFile;
		const filepath = `${MEDIA_PATH}/${filename}`;
		await storageModel.deleteOne({ _id: id });

		if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
		const data = {
			filepath,
			deleted: true,
		};
		res.send({ data });
	} catch (error) {
		console.log(error);
		handleHttpError(res, 'Error al eliminar item');
	}
};

module.exports = { getItems, getItem, createItem, deleteItem };
