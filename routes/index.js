var express = require('express');
var pg = require('pg');
var router = express.Router();
var connectionString = 'postgres://postgres:123456@localhost:5432/todo';

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
