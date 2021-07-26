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

  describe('#closePoll()', function () {

    it('should throw an error if no reason given', function () {
      assert.throws(db.closePoll, 'arg : reason,  must be an integer with value in {1,2}');
    });

  });

});

