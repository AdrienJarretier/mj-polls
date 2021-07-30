var common = require("../common.js");
var db = require('../db/db.js')({
  verbose: false
});

var assert = require('chai').assert;

const fs = require('fs');
const path = require('path');

describe('db', function () {

  before(function () {

    // common.serverConfig.db.database = path.resolve(__dirname, 'test.db');
    common.serverConfig.db.database = ':memory:';

    require('../db/createDb.js');

  });

  after(function () {

    if (common.serverConfig.db.database != ':memory:')
      fs.rmSync(common.serverConfig.db.database);

  });

  describe('#insertPoll', function () {

    it('should not ignore constraints if ignoreConstraints is not given and throw an error if violated', function () {

      assert.throws(function () {

        db.insertPoll({
          title: 'testPoll invalid reason',
          maxVotes: null,
          max_datetime: '2021-07-01 00:00:00', // constraint violation, max date on insert can't be earleir than now
          choices: ['testChoice1'],
          duplicateCheckMethod: null
        });

      }, "Can't insert poll, constraint violated");

    });

    it('should ignore constraints if ignoreConstraints is true, and should not throw an error', function () {

      assert.doesNotThrow(function () {

        db.insertPoll({
          title: 'testPoll invalid reason',
          maxVotes: null,
          max_datetime: null, // constraint violation, max date on insert can't be earleir than now
          choices: ['testChoice1'],
          duplicateCheckMethod: null
        });

      });

    });

  });

  describe('#closePoll', function () {

    describe('invalid reason', function () {

      let pollId;
      before(function () {

        pollId = db.insertPoll({
          title: 'testPoll invalid reason',
          maxVotes: null,
          max_datetime: null,
          choices: ['testChoice1'],
          duplicateCheckMethod: null
        });

      });

      it('should throw an error if reason is invalid', function () {
        const possibleReasons = [1, 2];
        assert.throws(db.closePoll, 'arg : reason,  must be an integer with value in ' + possibleReasons);
      });

      it('should throw an error if reason is 1 and max_voters is null', function () {
        assert.throws(function () { db.closePoll(pollId, 1) }, 'Can\'t close poll, max_voters is NULL');
      });

      it('should throw an error if reason is 2 and max_datetime is null', function () {
        assert.throws(function () { db.closePoll(pollId, 2) }, 'Can\'t close poll, max_datetime is NULL');
      });

    });

    describe('valid reasons and opened poll', function () {

      let pollId;
      beforeEach(function () {

        pollId = db.insertPoll({
          title: 'testPoll valid reasons and opened poll',
          maxVotes: 1,
          max_datetime: '2100-01-01 00:00:00',
          choices: ['testChoice1'],
          duplicateCheckMethod: null
        });

      });

      it('if reason is 1 and max_voters is not null, should set datetime_closed to CURRENT_TIMESTAMP', function () {

        let dateBefore = (new Date());
        dateBefore.setMilliseconds(0);

        db.closePoll(pollId, 1);
        let dateAfter = (new Date());
        let dateClosed = (new Date(db.getPoll(pollId).datetime_closed + 'Z'));

        assert.isAtLeast(dateClosed, dateBefore);
        assert.isAtMost(dateClosed, dateAfter);
      });

      it('if reason is 2 and max_datetime is not null, should set datetime_closed to max_datetime', function () {

        db.closePoll(pollId, 2);

        let poll = db.getPoll(pollId);
        let dateClosed = (new Date(poll.datetime_closed + 'Z'));
        let dateMax = (new Date(poll.max_datetime + 'Z'));

        assert.deepEqual(dateClosed, dateMax);
      });


    });

    describe('valid reason but already closed poll', function () {

      let pollId;
      before(function () {

        pollId = db.insertPoll({
          title: 'testPoll valid reason but already closed poll',
          maxVotes: 1,
          max_datetime: '2100-01-01 00:00:00',
          choices: ['testChoice1'],
          duplicateCheckMethod: null
        });

        // closing poll to test later if error is thrown
        db.closePoll(pollId, 1);

      });

      it('should throw an error if poll is already closed', function () {
        assert.throws(function () { db.closePoll(pollId, 1) }, 'poll is already closed');
        assert.throws(function () { db.closePoll(pollId, 2) }, 'poll is already closed');
      });

    });

  });

  describe('#isClosed', function () {

    it('should return false if date_closed is null', function () {

      let pollId = db.insertPoll({
        title: 'testPoll invalid reason',
        maxVotes: 1,
        max_datetime: null,
        choices: ['testChoice1'],
        duplicateCheckMethod: null
      });

      let pollId2 = db.insertPoll({
        title: 'testPoll invalid reason',
        maxVotes: 1,
        max_datetime: '2100-01-01 00:00:00',
        choices: ['testChoice1'],
        duplicateCheckMethod: null
      });

      assert.isFalse(db.isClosed(pollId));
      assert.isFalse(db.isClosed(pollId2));

    });

    it('should return true if date_closed is not null', function () {

      let pollId = db.insertPoll({
        title: 'testPoll invalid reason',
        maxVotes: 1,
        max_datetime: null,
        choices: ['testChoice1'],
        duplicateCheckMethod: null
      });
      db.closePoll(pollId, 1);

      assert.isTrue(db.isClosed(pollId));

    });


    // it('should return true if max_datetime is expired', function () {

    //   let pollId = db.insertPoll({
    //     title: 'testPoll invalid reason',
    //     maxVotes: 1,
    //     max_datetime: '2021-07-01 00:00:00',
    //     choices: ['testChoice1'],
    //     duplicateCheckMethod: null
    //   });

    //   assert.isTrue(db.isClosed(pollId));

    // });

  });

});

