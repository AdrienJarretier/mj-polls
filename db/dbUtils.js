'use strict';

const common = require("../common.js");

const config = common.serverConfig;

const Database = require('better-sqlite3');

function _executePrepared(stmt, executionMethod, bindParameters, expand) {

    switch (executionMethod) {

        case 'all':
            stmt.expand(expand);
            return stmt.all(bindParameters);

        case 'get':
            stmt.expand(expand);
            return stmt.get(bindParameters);

        case 'run':
            return stmt.run(bindParameters);

    }

}

function executeLoop(sqlString, arrayOfBindParameters) {


    // console.log('executeLoop');

    const db = new Database(config.db.database);

    // console.log('db opened');
    let arrayOfResults = [];

    const stmt = db.prepare(sqlString);
    // console.log('stmt prepared');

    const runMany = db.transaction((arrayOfBindParameters) => {

        // console.log('run many with :', arrayOfBindParameters)

        for (let bindParameters of arrayOfBindParameters) {
            bindParameters = bindParameters || [];

            // console.log('run with', bindParameters);
            arrayOfResults.push(stmt.run(bindParameters));
        }

    });

    // console.log('arrayOfBindParameters', arrayOfBindParameters);
    runMany(arrayOfBindParameters);


    db.close();

    return arrayOfResults;

}

function executeStatement(sqlString, executionMethod, bindParameters, expand) {

    bindParameters = bindParameters || [];
    expand = expand || false;

    const db = new Database(config.db.database, { verbose: console.log });
    const stmt = db.prepare(sqlString);

    let results = _executePrepared(stmt, executionMethod, bindParameters, expand);

    db.close();

    return results;


}

exports.executeStatement = executeStatement;
exports.executeLoop = executeLoop;