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

app.all('*', (req, res, next) => {
    const err = new Error(`Can't find ${req.originalUrl} on this server!`);
    err.status = 'fail';
    err.statusCode = 404;
    
    next(err);
  });


app.use((err, req, res, next) => {

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
  
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  });

module.exports = app;