const express = require('express');
const app = express();
const cors = require('cors');
require('express-async-errors');

const contacts = require('./routes/contactsRoute');
const users = require('./routes/userRoute');
const login = require('./routes/loginRoute');

const middleware = require('./utils/middleware');

app.use(cors());
app.use(express.json());

app.use('/api/contacts', middleware.userExtractor, middleware.checkAuthentication, contacts);
app.use('/api/users', users);
app.use('/api/login', login);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;