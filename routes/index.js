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

  let recentPolls = prepareObjectForFrontend(
    Object.values(
      db.getMostRecentPolls(8)
    )
  );

  res.render('index', pageOptions('', {
    recentPolls: recentPolls
  }));
});

function renderPollResults(req, res) {

  try {
    let poll = db.getFullPoll(res.locals.pollId);

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

  return function (req, res) {

    const duplicateCheckMethods = db.getDuplicateCheckMethods();

    res.render(viewName, pageOptions('Create Poll', {

      duplicateCheckMethods: prepareObjectForFrontend(db.getDuplicateCheckMethods()),
      grades: prepareObjectForFrontend(db.getGrades())

    }));
  }
}

function handlePollView(viewName) {

  return function (req, res, next) {
    try {

      let pollId = db.getIdFromUUID(req.params.uuid);

      // if poll is closed, send results, else send poll choices;
      if (db.isClosed(pollId)) {
        next();
      }
      else {

        let poll = db.getPoll(pollId);

        const pollJSONstr = prepareObjectForFrontend(poll);

        res.render(viewName, pageOptions(poll.title, {

          poll: pollJSONstr,
          infiniteVoteEnabled: common.serverConfig.testConfig.infiniteVoteEnabled,
          grades: prepareObjectForFrontend(db.getGrades())

        }));
      }

    }
    catch (e) {
      console.error(e);
    }
  }
}

/* Old poll creation page. */
router.get('/oldCreate', handleCreatePoll('createPoll'));


router.get('/poll/:uuid', handlePollView('poll_display_create'), renderPollResults);


router.get('/createPoll', handleCreatePoll('poll_display_create'));



router.get('/poll_results/:uuid', function (req, res, next) {

  res.locals.pollId = db.getIdFromUUID(req.params.uuid);

  let poll = db.getPoll(res.locals.pollId);
  // console.log(poll);

  if (common.serverConfig.testConfig.testApiEnabled ||
    (poll.max_voters === null && poll.max_datetime === null)) {

    next();
  }
  else {
    next(createError(403));
  }
}, renderPollResults);


/* GET context page. */
router.get('/context', function (req, res, next) {
  res.render('context', GLOBAL_OPTIONS);
});


module.exports = router;
