var express = require('express');
var router = express.Router();

var db = require('../db/db.js')({});

const common = require("../common.js");

const GLOBAL_OPTIONS = { globalTitle: 'MJ-Voting' }

function prepareObjectForFrontend(object) {

  return JSON.stringify(object)
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/"/g, "\\\"");

}

function pageOptions(pageTitle, otherOptions) {

  let options = {};

  if (pageTitle)
    Object.assign(options, { 'pageTitle': pageTitle });

  if (otherOptions)
    Object.assign(options, otherOptions);

  Object.assign(options, GLOBAL_OPTIONS);

  return options;

}

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', pageOptions());
});


/* GET poll creation page. */
router.get('/createPoll', function (req, res, next) {

  const duplicateCheckMethods = db.getDuplicateCheckMethods();

  res.render('createPoll', pageOptions('Create Poll', {

    duplicateCheckMethods: prepareObjectForFrontend(db.getDuplicateCheckMethods())

  }));

});

router.get('/poll/:id', function (req, res, next) {

  // if poll is closed, send results, else send poll choices;
  if (db.isClosed(req.params.id)) {
    next();
  }
  else {

    let poll = db.getPoll(req.params.id);

    const pollJSONstr = prepareObjectForFrontend(poll);

    res.render('poll', pageOptions(poll.title, {

      poll: pollJSONstr,
      infiniteVoteEnabled: common.serverConfig.testConfig.infiniteVoteEnabled

    }));

  }

}, function (req, res) {

  let poll = db.getFullPoll(req.params.id);

  const pollJSONstr = prepareObjectForFrontend(poll);

  res.render('poll_results', pageOptions('results ' + poll.title, {
    poll: pollJSONstr
  }));

});


/* GET context page. */
router.get('/context', function (req, res, next) {
  res.render('context', GLOBAL_OPTIONS);
});


module.exports = router;
