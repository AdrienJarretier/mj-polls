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

function insertPoll(data) {

    // ------------------------- prepare Data -------------------------

    if (data.maxVotes == '')
        data.maxVotes = null;

    // if(data.maxDate == '')
    //     data.maxDate = null;

    let max_datetime = new Date();
    max_datetime = max_datetime.toISOString();

    console.log('exports.insertPoll');
    console.log(data);

    // ----------------------------------------------------------------


    let pollsInsertResult;

    try {

        pollsInsertResult = executeStatement(`
        INSERT INTO polls(title, max_voters, max_datetime)
        VALUES(?, ?, ?);
        `, 'run', [data.title, data.maxVotes, max_datetime]);

    }
    catch (e) {
        console.error('error inserting into polls');
        console.error(e);
    }

    let pollId = pollsInsertResult.lastInsertRowid;

    // ------------------------ INSERT choices ------------------------

    let gradesIds = exports.getGrades().map(g => g.id);

    let pcs_inserts_params = [];

    for (let choiceId of data.choices) {
        pcs_inserts_params.push([pollId, choiceId])
    }

    // console.log('pcs_inserts_params', pcs_inserts_params);

    let pcs_insertsResults
    try {
        pcs_insertsResults = executeLoop(`
        INSERT INTO polls_choices(poll_id, name)
        VALUES(?, ?);
        `, pcs_inserts_params);
    }
    catch (e) {
        console.error('error inserting into polls_choices');
        console.error(e);
    }

    // ----------------------------------------------------------------

    // ---------------------- INSERT polls_votes ----------------------

    let pvs_inserts_params = [];

    for (let pc_insertResult of pcs_insertsResults) {

        let pcId = pc_insertResult.lastInsertRowid;

        for (let gradeId of gradesIds) {
            pvs_inserts_params.push([pcId, gradeId]);
        }

    }

    // console.log('pvs_inserts_params', pvs_inserts_params);

    try {
        executeLoop(`
        INSERT INTO polls_votes(poll_choice_id, grade_id)
        VALUES(?, ?);
        `,
            pvs_inserts_params
        );
    }
    catch (e) {
        console.error('error inserting into polls_votes');
        console.error(e);
    }

    // ----------------------------------------------------------------

    return pollsInsertResult.lastInsertRowid;

}

function dummyInsertPoll(data) {

    console.log(data);

}

exports.insertPoll = insertPoll;

exports.addVote = function (vote) {

    console.log('adding vote');

    let voteEntries = Object.entries(vote);

    let updatesResults = executeLoop(`
    UPDATE polls_votes
    SET count = count+1
    WHERE poll_choice_id = ?
    AND grade_id = ?
    ;`,
        voteEntries);


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

    return executeStatement(`
    SELECT * FROM grades ORDER BY "order";
    `
        , 'all');

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
        // console.log(choice['votes']);

        for (let vote of polls_votes) {

            if (vote.poll_choice_id == choice.id) {

                // console.log(vote.grade_id, vote.count);
                choice['votes'][vote.grade_id].count = vote.count;
                // console.log(choice);

            }

        }

    }

    return poll;

}

// alternate Version, choices are the raw list from db inner join result
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


exports.getDuplicateCheckMethods = function () {

    return executeStatement(`
    SELECT * FROM duplicate_vote_check_methods`
        , 'all');

}


// ---------------------- Used for testing ----------------------
