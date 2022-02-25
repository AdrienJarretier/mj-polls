
// ------------------------------------------------------ REQUIRE

var express = require('express');
var router = express.Router();

// parse application/json

const common = require('../common.js');

const db = require('../db/db.js')({});



// ------------------------------------------------------ CONFIG

const apiDesc = common.serverConfig.api;

function makeSubroutes(routeDesc, completePath) {

    subroutesList = [];

    completePath = completePath || '';

    for (let [subPath, subRouteDesc] of Object.entries(routeDesc)) {

        let path = completePath + subPath;

        if (subRouteDesc.methods) {
            for (let [method, methodDesc] of Object.entries(subRouteDesc.methods)) {

                subroutesList.push({
                    'method': method,
                    'path': path,
                    'description': methodDesc
                });

            }
        }

        if (subRouteDesc.routes) {
            subroutesList = subroutesList.concat(makeSubroutes(subRouteDesc.routes, path));
        }

    }

    return subroutesList;
}

// console.table(makeSubroutes(apiDesc));


router.get('/grades', function (req, res, next) {

    res.json(db.getGrades());

});

router.get('/', function (req, res, next) {

    res.json({
        'pollsIds': db.getPollsIds(),
        'grades': db.getGrades()
    });

});

router.get('/full', function (req, res, next) {

    res.json(db.getFullPolls());

});

// router.get('/recent', function (req, res, next) {

//     res.json(db.getMostRecentPolls(8));

// });


router.get('/:id/vote', function (req, res, next) {

    res.json(db.getFullPoll(req.params.id));

});


router.get('/:id', function (req, res, next) {

    res.json(db.getPoll(req.params.id));

});

router.post('/:uuid/vote', function (req, res, next) {

    console.log('post new vote');

    const uuid = req.params.uuid;

    const pollId = db.getIdFromUUID(uuid);

    console.log('poll uuid : ' + uuid);
    console.log('poll id : ' + pollId);
    console.log(req.body);

    let responseObject = {
        'voteSuccessfull': false,
        'cause': 'unknown'
    };

    try {

        if (db.isClosed(pollId)) {
            console.error('vote on closed poll', req.body);
            responseObject.voteSuccessfull = false;
            responseObject.cause = 'poll closed';
        }
        else {
            responseObject.voteSuccessfull = db.addVote(pollId, req.body);
            if (responseObject.voteSuccessfull)
                delete responseObject.cause;
        }

        res.json(responseObject);

    } catch (e) {
        console.error("####################################");
        console.error("error in api.post('/:id/vote') :", e);
        console.error("####################################");

        res.json(responseObject);
    }

});

router.post('/', function (req, res, next) {

    console.log('post new poll');
    console.log(req.body);
    try {
        const lastInsertRowid = db.insertPoll(req.body);
        const pollUuid = db.getUUIDFromId(lastInsertRowid);
        res.json(pollUuid);
    }
    catch (e) {
        console.error(e);
    }

});

module.exports = router