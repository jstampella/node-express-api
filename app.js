require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morganBody = require('morgan-body');
const swaggerUI = require('swagger-ui-express');

const dbConnectNosql = require('./config/mongo');
const { dbConnectMysql } = require('./config/mysql');
const loggerStream = require('./utils/handleLogger');
const openApiConfig = require('./docs/swagger');
const ENGINE_DB = process.env.ENGINE_DB;
const NODE_ENV = process.env.NODE_ENV || 'development';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/storage/', express.static('storage'));

morganBody(app, {
	noColors: true,
	stream: loggerStream,
	skip: (req, res) => {
		return res.statusCode < 400;
	},
});

const port = process.env.PORT || 3000;

/**
 * Definir ruta de documentacion
 */
app.use('/documentation', swaggerUI.serve, swaggerUI.setup(openApiConfig));

/**
 *  Aqui invocamos a las rutas
 */

app.use('/api', require('./routes'));

if (NODE_ENV !== 'test') {
	app.listen(port, () => {
		console.log(`Tu app esta lista por http://localhost:${port}`);
	});
}

if (ENGINE_DB === 'nosql') dbConnectNosql();
else dbConnectMysql();

/**
 * para fines de testing se exporta
 */
module.exports = app;
