const createError = require('http-errors');
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

function renderPollResults(req, res) {

  try {
    let poll = db.getFullPoll(req.params.id);

    const pollJSONstr = prepareObjectForFrontend(poll);

    res.render('poll_results', pageOptions('results ' + poll.title, {
      poll: pollJSONstr
    }));
  }
  catch (e) {
    console.error(e);
  }

}

function handleCreatePoll(viewName) {

  return function (req, res, next) {

    const duplicateCheckMethods = db.getDuplicateCheckMethods();

    res.render(viewName, pageOptions('Create Poll', {

      duplicateCheckMethods: prepareObjectForFrontend(db.getDuplicateCheckMethods())

    }));
  }
}

function handlePollView(viewName) {

  return function (req, res, next) {
    try {

      // if poll is closed, send results, else send poll choices;
      if (db.isClosed(req.params.id)) {
        next();
      }
      else {

        let poll = db.getPoll(req.params.id);

        const pollJSONstr = prepareObjectForFrontend(poll);

        res.render(viewName, pageOptions(poll.title, {

          poll: pollJSONstr,
          infiniteVoteEnabled: common.serverConfig.testConfig.infiniteVoteEnabled

        }));
      }

    }
    catch (e) {
      console.error(e);
    }
  }
}

/* GET poll creation page. */
router.get('/createPoll', handleCreatePoll('createPoll'));
router.get('/poll/:id', handlePollView('poll'), renderPollResults);


router.get('/newCreate', handleCreatePoll('display_create_poll'), renderPollResults);
router.get('/newPoll/:id', handlePollView('display_create_poll'), renderPollResults);


router.get('/poll_results/:id', function (req, res, next) {

  let poll = db.getPoll(req.params.id);
  console.log(poll);

  if (common.serverConfig.testConfig.testApiEnabled ||
    (poll.max_voters === null && poll.max_datetime === null)) {

    renderPollResults(req, res);
  }
  else {
    next(createError(403));
  }
});


/* GET context page. */
router.get('/context', function (req, res, next) {
  res.render('context', GLOBAL_OPTIONS);
});


module.exports = router;
