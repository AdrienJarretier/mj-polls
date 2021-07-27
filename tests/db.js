var common = require("../common.js");
var db = require('../db/db.js');

var assert = require('chai').assert;

const fs = require('fs');
const path = require('path');

describe('db', function () {

  before(function () {

    common.serverConfig.db.database = path.resolve(__dirname, 'test.db');
    fs.rmSync(common.serverConfig.db.database);
    require('../db/createDb.js');

  });

  let pollId;
  beforeEach(function () {

    pollId = db.insertPoll({
      title: 'testPoll',
      maxVotes: null,
      max_datetime: null,
      choices: ['testChoice1'],
      duplicateCheckMethod: null
    });
    console.log('inserted poll id', pollId);

  });

  describe('#closePoll()', function () {


    it('should throw an error if no reason given', function () {
      assert.throws(db.closePoll, 'arg : reason,  must be an integer with value in {1,2}');
    });


  });


  describe('#closePoll(pollId, 1)', function () {

    it('should set datetime_closed to CURRENT_TIMESTAMP', function () {

      let dateBefore = (new Date());
      dateBefore.setMilliseconds(0);

      // console.log(dateBefore.toISOString());

      db.closePoll(pollId, 1);
      let dateAfter = (new Date());
      let dateClosed = (new Date(db.getPoll(pollId).datetime_closed + 'Z'));

      // console.log(dateClosed.toISOString());
      // console.log(dateAfter.toISOString());

      assert.isAtLeast(dateClosed, dateBefore);
      assert.isAtMost(dateClosed, dateAfter);
    });

  });

});

