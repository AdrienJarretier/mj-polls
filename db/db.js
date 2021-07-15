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

// exports.getFullPolls = function () {

//     return executeStatement(`
//     SELECT *
//     FROM polls
//     INNER JOIN ;
//     `,
//         'all', null, true);

// }

exports.insertPoll = function (data) {

    console.log('exports.insertPoll');
    console.log(data);

    return executeStatement(`
    INSERT INTO polls(title)
    VALUES(?);
    `, 'run', [data.title]);

}

exports.getGrades = function () {

    return executeStatement('SELECT * FROM grades ORDER BY "order";', 'all');

}
