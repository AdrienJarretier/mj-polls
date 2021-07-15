"use strict";

const dbUtils = require('./dbUtils.js');

let executeStatement = dbUtils.executeStatement;

exports.getPollsIds = function () {

    let rows = executeStatement(`
    SELECT id
    FROM polls;
    `,
        'all')

    let pollsIds = [];

    for (let row of rows) {
        pollsIds.push(row.id);
    }

    return pollsIds;

}

function aggregateChoices(resultRows) {

    let polls = {};

    for (let row of resultRows) {

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

exports.getFullPolls = function () {

    let rows = executeStatement(`
    SELECT *
    FROM polls
    INNER JOIN polls_choices
    ON polls.id=polls_choices.poll_id;
    `,
        'all', null, true);

    let polls = aggregateChoices(rows);

    return polls;

}

exports.getPoll = function (id) {

    let rows = executeStatement(`
    SELECT *
    FROM polls
    INNER JOIN polls_choices
    ON polls.id=polls_choices.poll_id
    WHERE polls.id = ?;
    `,
        'all', [id], true);

    let poll = aggregateChoices(rows)[id];

    return poll;

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

    return pollsInsertResult.lastInsertRowid;

}

exports.getGrades = function () {

    return executeStatement('SELECT * FROM grades ORDER BY "order";', 'all');

}
