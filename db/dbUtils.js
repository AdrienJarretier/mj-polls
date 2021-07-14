'use strict';

const common = require("../common.js");

const config = common.serverConfig;

const Database = require('better-sqlite3');


function executeStatement(sqlString, executionMethod, bindParameters, expand) {

    bindParameters = bindParameters || []

    expand = expand || false;

    const db = new Database(config.db.database, { verbose: console.log });

    const stmt = db.prepare(sqlString);

    let results;

    switch (executionMethod) {

        case 'all':
            stmt.expand(expand);
            results = stmt.all(bindParameters);
            break;

        case 'get':
            stmt.expand(expand);
            results = stmt.get(bindParameters);
            break;

        case 'run':
            results = stmt.run(bindParameters);
            break;

    }

    db.close();

    return results;

}

exports.executeStatement = executeStatement;