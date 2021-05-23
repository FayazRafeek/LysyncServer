var express = require('express');
var app = express();

var AuthController = require('./Auth/AuthController');
var apiRouter = require('./DataLogic/api');
var deviceRout = require('./DataLogic/Device')

app.use('/api/auth', AuthController);
app.use('/api/data', apiRouter);
app.use('/api/device', deviceRout);

module.exports = app;