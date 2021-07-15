"use strict";

const dbUtils = require('./dbUtils.js');

let executeStatement = dbUtils.executeStatement;

exports.getPolls = function () {

    return executeStatement(`
    SELECT *
    FROM polls;
    `,
        'all')

}

exports.getGrades = function () {

    return executeStatement('SELECT * FROM grades ORDER BY "order";', 'all');

}
