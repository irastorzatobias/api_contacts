const router = require('express').Router();
const { createUser, getAllUsers } = require('../controllers/usersController');

router.post('/', createUser);
router.get('/', getAllUsers);

module.exports = router;