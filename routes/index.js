var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Main page' });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Main page' });
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Main page' });
});

router.get('/forgot-password', function(req, res, next) {
  res.render('forgotPassword', { title: 'Main page' });
});

module.exports = router;
