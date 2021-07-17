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

  const pollJSONstr = JSON.stringify(poll).replace("'", "\\'");

  console.log(pollJSONstr);

  res.render('poll', Object.assign(
    {
      'pageTitle': poll.title,
      poll: pollJSONstr
    },
    GLOBAL_OPTIONS));
});

router.get('/poll_results/:id', function (req, res, next) {

  let poll = db.getFullPoll(req.params.id);
  // let poll = { "choices": [{ "id": 5, "poll_id": 2, "name": "haha", "votes": { "1": { "id": 1, "value": "Excellent", "order": 0, "count": 100 }, "2": { "id": 2, "value": "Passable", "order": 500, "count": 200 }, "3": { "id": 3, "value": "Bad", "order": 1000, "count": 50 } } }, { "id": 4, "poll_id": 2, "name": "hihi", "votes": { "1": { "id": 1, "value": "Excellent", "order": 0, "count": 50 }, "2": { "id": 2, "value": "Passable", "order": 500, "count": 100 }, "3": { "id": 3, "value": "Bad", "order": 1000, "count": 200 } } }], "id": 2, "title": "Test poll", "voters_count": 350, "max_voters": null, "max_datetime": null, "datetime_opened": "2021-07-17 00:21:56", "datetime_closed": null }
  //let poll = { "choices": [{ "id": 5, "poll_id": 2, "name": "haha", "votes": { "1": { "id": 1, "value": "Excellent", "order": 0, "count": 200 }, "2": { "id": 2, "value": "Passable", "order": 500, "count": 100 }, "3": { "id": 3, "value": "Bad", "order": 1000, "count": 50 } } }, { "id": 6, "poll_id": 2, "name": "hehe", "votes": { "1": { "id": 1, "value": "Excellent", "order": 0, "count": 100 }, "2": { "id": 2, "value": "Passable", "order": 500, "count": 200 }, "3": { "id": 3, "value": "Bad", "order": 1000, "count": 50 } } }, { "id": 4, "poll_id": 2, "name": "hihi", "votes": { "1": { "id": 1, "value": "Excellent", "order": 0, "count": 50 }, "2": { "id": 2, "value": "Passable", "order": 500, "count": 100 }, "3": { "id": 3, "value": "Bad", "order": 1000, "count": 200 } } }], "id": 2, "title": "Test poll", "voters_count": 350, "max_voters": null, "max_datetime": null, "datetime_opened": "2021-07-17 00:21:56", "datetime_closed": null }
  res.render('poll_results', Object.assign({ 'pageTitle': "results " + poll.title, poll: JSON.stringify(poll) }, GLOBAL_OPTIONS));
});

module.exports = router;
