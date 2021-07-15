var express = require('express');
var router = express.Router();

const GLOBAL_OPTIONS = { globalTitle: 'MJ-Voting' }

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', GLOBAL_OPTIONS);
});

router.get('/createPoll', function (req, res, next) {
  res.render('createPoll', Object.assign({ 'pageTitle': 'Create Poll' }, GLOBAL_OPTIONS));
});

module.exports = router;
