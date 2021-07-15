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

exports.getFullPolls = function () {

    let rows = executeStatement(`
    SELECT *
    FROM polls
    INNER JOIN polls_choices
    ON polls.id=polls_choices.poll_id;
    `,
        'all', null, true);

    let polls = {};

    for (let row of rows) {

        let id = row.polls.id;

        if (!(id in polls)) {

            polls[id] = { 'choices': [] };

            for (const [key, value] of Object.entries(row.polls)) {
                polls[id][key] = value;
            }

        }

        polls[id]['choices'].push(row.polls_choices);

    }

    return polls;

}

exports.insertPoll = function (data) {

    console.log('exports.insertPoll');
    console.log(data);

    let pollsInsertResult = executeStatement(`
    INSERT INTO polls(title)
    VALUES(?);
    `, 'run', [data.title]);

    for (let choice of data.choices) {

        executeStatement(`
        INSERT INTO polls_choices(poll_id, name)
        VALUES(?, ?);
        `, 'run', [pollsInsertResult.lastInsertRowid, choice]);

    }

    return pollsInsertResult;

}

exports.getGrades = function () {

    return executeStatement('SELECT * FROM grades ORDER BY "order";', 'all');

}
