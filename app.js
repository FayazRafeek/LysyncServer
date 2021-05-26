var express = require('express');
var app = express();

var AuthController = require('./Auth/AuthController');
var apiRouter = require('./DataLogic/api');
var deviceRout = require('./DataLogic/Device')
var fileHandle = require('./FileHandle/FileHandle')

app.use('/api/auth', AuthController);
app.use('/api/data', apiRouter);
app.use('/api/device', deviceRout);
app.use('/api/file', fileHandle);

module.exports = app;