
// ------------------------------------------------------ REQUIRE

var express = require('express');
var router = express.Router();

// parse application/json

const common = require('../common.js');

const db = require('../db/db.js');



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

console.table(makeSubroutes(apiDesc));


router.get('/', function (req, res, next) {

    res.json({
        'polls': db.getFullPolls(),
        'grades': db.getGrades()
    });

});

router.post('/', function (req, res, next) {

    console.log('post new poll');
    console.log(req.body);
    db.insertPoll(req.body);

});

router.get('/grades', function (req, res, next) {

    res.json(db.getGrades());

});

module.exports = router