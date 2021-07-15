var express = require('express');
var router = express.Router();

var db = require('../db/db.js');

const GLOBAL_OPTIONS = { globalTitle: 'MJ-Voting' }

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', GLOBAL_OPTIONS);
});

router.get('/createPoll', function (req, res, next) {
  res.render('createPoll', Object.assign({ 'pageTitle': 'Create Poll' }, GLOBAL_OPTIONS));
});

router.get('/poll/:id', function (req, res, next) {

  let poll = db.getPoll(req.params.id);
  res.render('poll', Object.assign({ 'pageTitle': poll.title, poll: JSON.stringify(poll) }, GLOBAL_OPTIONS));
});

module.exports = router;
