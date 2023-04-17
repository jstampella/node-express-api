const request = require('supertest');
const fs = require('fs');
const app = require('../app');
const { tokenSign } = require('../utils/handleJwt');
const { testAuthRegisterAdmin } = require('./helper/helperData');
const { usersModel } = require('../models');
const { storageModel } = require('../models');
const { default: mongoose } = require('mongoose');
let JWT_TOKEN = '';
const filePath = `${__dirname}/dump/file.jpg`;

describe('Pruebas en [STORAGE]', () => {
	beforeAll(async () => {
		await usersModel.deleteMany({});
		await storageModel.deleteMany({});
		const user = await usersModel.create(testAuthRegisterAdmin);
		JWT_TOKEN = await tokenSign(user);
	});

	afterAll(() => {
		mongoose.connection.close();
	});

	test('should uplaod file', async () => {
		// Test if the test file is exist
		if (fs.existsSync(filePath)) {
			const res = await request(app)
				.post('/api/storage')
				.set('Content-Type', 'multipart/form-data')
				.set('Authorization', `Bearer ${JWT_TOKEN}`)
				.attach('myFile', filePath);
			const { body } = res;
			expect(res.statusCode).toEqual(201);
			expect(body).toHaveProperty('data');
			expect(body).toHaveProperty('data.url');
		} else throw new Error('file does not exist');
	});

	test('should create a return all', async () => {
		const res = await request(app)
			.get('/api/storage')
			.set('Authorization', `Bearer ${JWT_TOKEN}`);
		const { body } = res;
		expect(res.statusCode).toEqual(200);
		expect(body).toHaveProperty('data');
	});

	test('debe retornar todo el detalle del item', async () => {
		const { _id } = await storageModel.findOne();
		id = _id.toString();

		const res = await request(app)
			.get(`/api/storage/${id}`)
			.set('Authorization', `Bearer ${JWT_TOKEN}`);
		const { body } = res;
		expect(res.statusCode).toEqual(200);
		expect(body).toHaveProperty('data');
	});

	test('debe eliminar el item', async () => {
		const { _id } = await storageModel.findOne();
		id = _id.toString();

		const res = await request(app)
			.delete(`/api/storage/${id}`)
			.set('Authorization', `Bearer ${JWT_TOKEN}`);
		const { body } = res;
		expect(res.statusCode).toEqual(200);
		expect(body).toHaveProperty('data');
		expect(body).toHaveProperty('data.deleted', true);
	});
});
