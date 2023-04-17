const { Sequelize } = require('sequelize');
const NODE_ENV = process.env.NODE_ENV;

const database =
	NODE_ENV === 'test'
		? process.env.MYSQL_DATABASE_TEST
		: process.env.MYSQL_DATABASE;
const username = process.env.MYSQL_USER;
const password = process.env.MYSQL_PASSWORD;
const host = process.env.MYSQL_HOST;

const sequelize = new Sequelize(database, username, password, {
	host,
	dialect: 'mysql',
});

const dbConnectMysql = async () => {
	try {
		await sequelize.authenticate();
		await sequelize.sync();
		console.log('MYSQL conexion correcta');
	} catch (error) {
		console.log('MYSQL erro de conexion', error);
	}
};

async function syncDatabase() {
	try {
		await sequelize.sync();
		console.log('All models were synchronized successfully.');
	} catch (error) {
		console.error('An error occurred while synchronizing the models:', error);
	}
}

module.exports = { sequelize, dbConnectMysql };
