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

function executeLoop(sqlString, executionMethod, arrayOfBindParameters, expand) {

    expand = expand || false;

    const db = new Database(config.db.database, { verbose: console.log });

    let arrayOfResults = []

    for (let bindParameters of arrayOfBindParameters) {

        bindParameters = bindParameters || [];

        const stmt = db.prepare(sqlString);

        arrayOfResults.push(_executePrepared(stmt, executionMethod, bindParameters, expand));

    }

    db.close();

    return arrayOfResults;

}

function executeStatement(sqlString, executionMethod, bindParameters, expand) {

    return executeLoop(sqlString, executionMethod, [bindParameters], expand)[0];

}

exports.executeStatement = executeStatement;
exports.executeLoop = executeLoop;