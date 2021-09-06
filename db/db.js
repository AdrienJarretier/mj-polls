"use strict";

const { uuid4 } = require('random-js');

module.exports = function (opts) {

    const dbUtils = require('./dbUtils.js')({
        verbose: opts.verbose
    });

    const { connect, close, prepareAndExecute, executeStatement, executeLoop } = dbUtils;

    const { randomUUID } = require('../common.js');

    // exports.getPollsUUIDs = function () {

    //     let rows = executeStatement(`
    // SELECT uuid
    // FROM polls;
    // `,
    //         'all')

    //     let pollsIds = [];

    //     for (let row of rows) {
    //         pollsIds.push(row.id);
    //     }

    //     return pollsIds;

    // }

    // for a list of results with polls and their choices
    // returns an object with polls ids as keys
    // values are the polls with an array of their choices
    function _aggregateChoices(resultRows) {

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


    // exports.getFullPolls = function () {

    //     let rows = executeStatement(`
    //     SELECT *
    //     FROM polls
    //     INNER JOIN polls_choices
    //     ON polls.id=polls_choices.poll_id;
    //     `,
    //         'all', null, true);

    //     console.log('---------------------------------')
    //     console.log(rows)

    //     let polls = _aggregateChoices(rows);

    //     return polls;

    // }

    function _removePollId(poll, propToDel = 'id') {

        for (let prop in poll) {
            if (prop == propToDel) {
                delete poll[prop];
            } else if (typeof poll[prop] == 'object')
                _removePollId(poll[prop], 'poll_id');
        }
        return poll;
    }

    function getMostRecentPolls(limit) {

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

        let polls = _aggregateChoices(rows);
        for (let p of Object.values(polls)) {
            _removePollId(p);
        }
        // console.log('---------------------------------')
        // console.log(polls)

        return polls;

    }

    /**
     * 
     * @param {number} id - poll id
     * @returns {{seeBelow}} \{
     * - uuid: string
     * - title: string
     * - max_voters: integer | null
     * - max_datetime: string | null
     * - datetime_opened: string
     * - datetime_closed: string | null
     * - duplicate_vote_check_method_id: integer | null
     * - choices: Array
     * - [ 
     * - - {id: integer, name: string}
     * - ]
     * 
     * }
     */
    function getPoll(id) {

        let rows = executeStatement(`
        SELECT *
        FROM polls
        INNER JOIN polls_choices
        ON polls.id=polls_choices.poll_id
        WHERE polls.id = ?;
        `,
            'all', [id], true);

        let poll = _removePollId(_aggregateChoices(rows)[id]);

        return poll;

    }

    /**
     * 
     * @param {number} uuid - poll uuid
     * @returns {number} poll id in db
     */
    function getIdFromUUID(uuid) {

        let row = executeStatement(`
        SELECT id
        FROM polls
        WHERE polls.uuid = ?;
        `,
            'get', [uuid]);

        return row.id;
    }

    /**
     * 
     * @param {number} id - poll id
     * @returns {number} poll uuid in db
     */
    function getUUIDFromId(id) {

        let row = executeStatement(`
        SELECT uuid
        FROM polls
        WHERE polls.id = ?;
        `,
            'get', [id]);

        return row.uuid;
    }

    /*
        data should be an object with at least those params :
        {
            title: string
            maxVotes: null or int
            max_datetime: null or string 'YYYY-MM-DD HH:MM:SS'
            choices: array of strings : [choiceName1, ...]
            duplicateCheckMethod: null or int (id of method)
        }

        Returns the id of the inserted poll
    */
    function insertPoll(data, ignoreConstraints) {

        ignoreConstraints = ignoreConstraints || false;

        // ------------------------- prepare Data -------------------------

        if (data.maxVotes == '')
            data.maxVotes = null;


        // ----------------------------------------------------------------

        let db = dbUtils.connect();
        let pollId;

        db.transaction(() => {

            try {

                if (ignoreConstraints)
                    db.pragma('ignore_check_constraints = 1');

                const uuid = randomUUID();

                // if title is not only whitespaces
                const re = /^\s*(\S.*?\S?)\s*$/;
                const matched = data.title.match(re);

                if(!matched) {
                    throw 'db.insertPoll() : title is only whitespaces';
                }

                let pollsInsertResult = prepareAndExecute(db, `
                INSERT INTO polls(uuid, title, max_voters, max_datetime)
                VALUES(?, ?, ?, datetime(?));
                `, 'run', [uuid, data.title, data.maxVotes, data.max_datetime]);

                pollId = pollsInsertResult.lastInsertRowid;

            }
            catch (e) {
                if (e.code == 'SQLITE_CONSTRAINT_CHECK')
                    throw "Can't insert poll, constraint violated";
                else
                    throw e;
            }

            // ------------------------ INSERT choices ------------------------

            let gradesIds = getGrades().map(g => g.id);

            let stmt = db.prepare(`INSERT INTO polls_choices(poll_id, name) VALUES(?, ?);`);
            let pcs_insertsResults = [];

            try {
                for (let choiceName of data.choices) {

                    const re = /^\s*(\S.*?\S?)\s*$/;
                    const matched = choiceName.match(re);
                    if (matched) {
                        pcs_insertsResults.push(stmt.run([pollId, matched[1]]));
                    }
                }
                if (pcs_insertsResults.length == 0) {
                    throw 'db.insertPoll() : no choices inserted, aborting poll insertion';
                }
            }
            catch (e) {
                throw e;
            }

            // ----------------------------------------------------------------

            // ---------------------- INSERT polls_votes ----------------------

            stmt = db.prepare(`INSERT INTO polls_votes(poll_choice_id, grade_id) VALUES(?, ?);`);
            try {
                for (let pc_insertResult of pcs_insertsResults) {

                    let pcId = pc_insertResult.lastInsertRowid;

                    for (let gradeId of gradesIds) {
                        stmt.run([pcId, gradeId]);
                    }

                }
            }
            catch (e) {
                console.error('error inserting into polls_votes');
                console.error(e);
            }

            // ----------------------------------------------------------------

        })();

        dbUtils.close(db);

        // ----------------------------------------------------------------

        return pollId;

    }

    function dummyInsertPoll(data) {

        console.log(data);

    }

    // exports.get_poll_id_From_poll_choice_id = function (poll_choice_id) {

    //     return dbUtils.executeStatement(`
    //     SELECT poll_id
    //     FROM polls_choices
    //     WHERE id = ?;`,
    //         'get', [poll_choice_id]).poll_id;

    // };

    /**
     * 
     * @param {number} pollId - the id of the poll on which to vote 
     * @param {object} vote - { poll_choice_id : grade_id , ... }
     * @returns {boolean} - true if vote successfull | false otherwise
     */
    function addVote(pollId, vote) {

        let db = dbUtils.connect();

        let updateSuccess = false;

        db.transaction(() => {

            let choices_ids = dbUtils.prepareAndExecute(db,
                `SELECT id
            FROM polls_choices AS pc
            WHERE pc.poll_id = ?;`,
                'all', [pollId], false, true
            ).flat();

            let voteEntries = Object.entries(vote);

            if (voteEntries.length != choices_ids.length)
                throw 'number of votes does not match number of choices in ' + pollId;

            for (let voteEntry of voteEntries) {
                let choice_id = parseInt(voteEntry[0]);
                if (!choices_ids.includes(choice_id)) {
                    throw 'choice ' + choice_id + ' does not belong to poll ' + pollId;
                }
            }

            let updatesResults = executeLoop(`
            UPDATE polls_votes
            SET count = count+1
            WHERE poll_choice_id = ?
            AND grade_id = ?
            ;`,
                voteEntries, db);

            // update unsuccessfull
            if (updatesResults.length < voteEntries.length)
                return false;

            for (let updateResult of updatesResults) {
                // update unsuccessfull
                if (updateResult.changes != 1)
                    return false;
            }

            updateSuccess = true;

            let { votes_count, max_voters } = dbUtils.prepareAndExecute(db,
                `SELECT sum(count) as votes_count, max_voters
            FROM polls AS p
            INNER JOIN polls_choices AS pc
            ON p.id = pc.poll_id
            INNER JOIN polls_votes AS pv
            ON pc.id = pv.poll_choice_id
            WHERE p.id = ?
            GROUP BY pc.id
            LIMIT 1;`,
                'get', [pollId]);

            if (max_voters !== null && votes_count >= max_voters) {
                closePoll(pollId, 1, db);
            }

        })();

        dbUtils.close(db);

        // update success
        return updateSuccess;

    }

    function getGrades() {

        return executeStatement(`
    SELECT * FROM grades ORDER BY "order";
    `
            , 'all');

    }



    function getFullPoll(poll_id) {

        let poll = getPoll(poll_id);

        let polls_votes = executeStatement(`
    SELECT pv.* FROM polls_votes AS pv
    INNER JOIN polls_choices AS pc ON pv.poll_choice_id=pc.id
    WHERE pc.poll_id = ?;
    `, 'all', [poll_id]);

        let grades = getGrades();

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


    function getDuplicateCheckMethods() {

        return executeStatement(`
    SELECT * FROM duplicate_vote_check_methods`
            , 'all');

    }

    /**
     * 
     * @param {dbConnection object} db 
     * @param {number} pollId 
     * @param {(1|2)} reason - 1, number of votes exceed max_voters <br>
     * - 2, max_datetime expired
     */
    function _closePoll(db, pollId, reason) {

        switch (reason) {
            case 1:

                return prepareAndExecute(db, `
                UPDATE polls SET datetime_closed=CURRENT_TIMESTAMP WHERE id=?;
                `, 'run', [pollId]);

            case 2:

                return prepareAndExecute(db, `
                UPDATE polls SET datetime_closed=max_datetime WHERE id=?;
                `, 'run', [pollId]);
        }
    }

    function isClosed(pollId, db) {

        if (!Number.isInteger(parseInt(pollId)) || pollId < 1)
            throw 'db.isClosed() : argError : pollId';

        let localDbConnection;
        if (!db) {
            localDbConnection = connect();
        }
        else
            localDbConnection = db;

        let row = prepareAndExecute(localDbConnection, `
        SELECT max_datetime, datetime_closed FROM polls WHERE id=?;
        `, 'get', [pollId]);

        let datetime_closed = row.datetime_closed;

        let maxDatetime = new Date(row.max_datetime + 'Z');
        if (maxDatetime < new Date()) {
            _closePoll(localDbConnection, pollId, 2);
            datetime_closed = maxDatetime;
        }

        if (!db)
            close(localDbConnection);

        return datetime_closed != null;
    }

    /*
        There are only 2 instances when a poll will close
        1 - the number of votes exceed max_voters   =>  datetime_closed <- CURRENT_TIMESTAMP
        2 - the max_datetime has expired            =>  datetime_closed <- max_datetime 

        @ 
        reason : in, value of 1 or 2 as stated above.

        errors throwns :
            - no reason given
            - reason 1, if max_voters is null
            - reason 2, if max_datetime is null
    */
    function closePoll(pollId, reason, db) {

        const possibleReasons = [1, 2];

        let localDbConnection;

        if (possibleReasons.includes(reason)) {

            localDbConnection = db || connect();

            if (isClosed(pollId, localDbConnection))
                throw 'poll is already closed';

        } else {

            throw 'arg : reason,  must be an integer with value in ' + possibleReasons;

        }

        switch (reason) {
            case 1:

                let max_voters = prepareAndExecute(localDbConnection, `
                SELECT max_voters FROM polls WHERE id=?;
                `, 'get', [pollId]).max_voters;

                if (max_voters === null)
                    throw 'Can\'t close poll, max_voters is NULL';

                break;

            case 2:

                let max_datetime = prepareAndExecute(localDbConnection, `
                SELECT max_datetime FROM polls WHERE id=?;
                `, 'get', [pollId]).max_datetime;

                if (max_datetime === null)
                    throw 'Can\'t close poll, max_datetime is NULL';

                break;
        }

        let results = _closePoll(localDbConnection, pollId, reason);

        if (!db)
            close(localDbConnection);

        return results;

    }

    return {
        getPoll: getPoll,
        getIdFromUUID: getIdFromUUID,
        getUUIDFromId: getUUIDFromId,
        insertPoll: insertPoll,
        addVote: addVote,
        isClosed: isClosed,
        closePoll: closePoll,
        getDuplicateCheckMethods: getDuplicateCheckMethods,
        getMostRecentPolls: getMostRecentPolls,
        getGrades: getGrades,
        getFullPoll: getFullPoll
    };

};

// ---------------------- Used for testing ----------------------
