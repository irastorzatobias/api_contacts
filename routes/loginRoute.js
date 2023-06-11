const loginRouter = require('express').Router();
const { handleLogin } = require('../controllers/loginController');

loginRouter.post('/', handleLogin);

module.exports = loginRouter;