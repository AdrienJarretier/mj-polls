
// ------------------------------------------------------ REQUIRE

var express = require('express');
var router = express.Router();

// parse application/json

const common = require('../common.js');

const db = require('../db/db.js');



// ------------------------------------------------------ CONFIG

const apiDesc = common.serverConfig.testApi;

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

router.get('/polls/:id', function (req, res, next) {

    res.json(db.getFullPoll(req.params.id));

});

module.exports = router