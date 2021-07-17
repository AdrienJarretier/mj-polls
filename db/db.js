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

// for a list of results with polls and their choices
// returns an object with polls ids as keys
// values are the polls with an array of their choices
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

exports.getMostRecentPolls = function (limit) {

    let rows = executeStatement(`

    SELECT *
    FROM
        (SELECT *
        FROM polls
        ORDER BY datetime_opened DESC
        LIMIT ?) as subq
    INNER JOIN polls_choices
    ON subq.id=polls_choices.poll_id;
    `,
        'all', [limit], true);

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

        let poll_choice_insertResult = executeStatement(`
        INSERT INTO polls_choices(poll_id, name)
        VALUES(?, ?);
        `, 'run', [pollsInsertResult.lastInsertRowid, choice]);

        for (let g of exports.getGrades()) {

            executeStatement(`
            INSERT INTO polls_votes(poll_choice_id, grade_id)
            VALUES(?, ?);
            `, 'run', [poll_choice_insertResult.lastInsertRowid, g.id]);

        }

    }

    return pollsInsertResult.lastInsertRowid;

}

exports.getGrades = function () {

    return executeStatement('SELECT * FROM grades ORDER BY "order";', 'all');

}

exports.getVotes = function (poll_id) {

    let poll = exports.getPoll(poll_id);

    let polls_votes = executeStatement(`
    SELECT * FROM polls_votes;
    `, 'all');

    let grades = exports.getGrades();

    for (let choice of poll.choices) {

        choice['votes'] = {};

        for (let grade of grades) {
            choice['votes'][grade.id] = grade;

        }

        for (let vote of polls_votes) {

            if (vote.poll_choice_id == choice.id) {

                choice['votes'][vote.grade_id].count = vote.count;

            }

        }

    }

    return poll;

}
