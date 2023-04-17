const customHeader = (req, res, next) => {
	try {
		const apiKey = req.headers.api_key;
		if (apiKey == 'api_privada') {
			next();
		} else {
			res.status(400).send({ error: 'Api key no es correcta' });
		}
	} catch (error) {
		res.status(403);
		res.send({ error: 'Ocurrio un error en el servidor' });
	}
};

module.exports = customHeader;
