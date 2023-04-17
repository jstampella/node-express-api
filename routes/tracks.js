const express = require('express');
const {
	getItems,
	getItem,
	createItem,
	updateItem,
	deleteItem,
} = require('../controllers/tracks');
const {
	validatorCreateItem,
	validatorGetItem,
} = require('../validators/tracks');
const customHeader = require('../middleware/customHeader');
const authMiddleware = require('../middleware/session');
const checkRol = require('../middleware/role');
const router = express.Router();

//TODO http://localhost/tracks GET,POST, DELETE, PUT

router.get('/', [authMiddleware], getItems);
router.get('/:id', [authMiddleware, validatorGetItem], getItem);
router.put(
	'/:id',
	[authMiddleware, validatorGetItem, validatorCreateItem],
	updateItem
);
router.post(
	'/',
	[authMiddleware, checkRol(['admin']), validatorCreateItem],
	createItem
);
router.delete(
	'/:id',
	[authMiddleware, checkRol(['admin']), validatorGetItem],
	deleteItem
);

module.exports = router;
