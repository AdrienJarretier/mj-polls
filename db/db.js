"use strict";

const dbUtils = require('./dbUtils.js');

let executeStatement = dbUtils.executeStatement;
let executeLoop = dbUtils.executeLoop;

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

            polls[id] = {};

            for (const [key, value] of Object.entries(row.polls)) {
                polls[id][key] = value;
            }

            polls[id]['choices'] = [];
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

exports.addVote = function (vote) {

    console.log('adding vote');

    let voteEntries = Object.entries(vote);

    let updatesResults = executeLoop(`
    UPDATE polls_votes
    SET count = count+1
    WHERE poll_choice_id = ?
    AND grade_id = ?
    ;`,
        'run', voteEntries);


    // update unsuccessfull
    if (updatesResults.length < voteEntries.length)
        return false;

    for (let updateResult of updatesResults) {
        // update unsuccessfull
        if (updateResult.changes != 1)
            return false;
    }

    // update success
    return true;

}

exports.getGrades = function () {

    return executeStatement('SELECT * FROM grades ORDER BY "order";', 'all');

}



exports.getFullPoll = function (poll_id) {

    let poll = exports.getPoll(poll_id);

    let polls_votes = executeStatement(`
    SELECT pv.* FROM polls_votes AS pv
    INNER JOIN polls_choices AS pc ON pv.poll_choice_id=pc.id
    WHERE pc.poll_id = ?;
    `, 'all', [poll_id]);

    let grades = exports.getGrades();

    for (let choice of poll.choices) {

        choice['votes'] = {};

        for (let grade of grades) {
            choice['votes'][grade.id] = Object.assign({}, grade);
        }

        for (let vote of polls_votes) {

            if (vote.poll_choice_id == choice.id) {

                console.log(vote.grade_id, vote.count);
                choice['votes'][vote.grade_id].count = vote.count;
                console.log(choice);

            }

        }

    }

    return poll;

}

// alternateVersion chere choices are the raw list from db inner join result
// exports.getVotes = function (poll_id) {

//     return Object.assign(exports.getPoll(poll_id),
//         {
//             "choices": executeStatement(`
//             SELECT name, value, count, "order" FROM polls_votes AS pv
//             INNER JOIN polls_choices AS pc ON pv.poll_choice_id=pc.id
//             INNER JOIN polls on pc.poll_id=polls.id
//             INNER JOIN grades AS g on pv.grade_id=g.id
//             WHERE polls.id = ?
//             `, 'all', [poll_id], false)
//         });

// }



// ---------------------- Used for testing ----------------------
