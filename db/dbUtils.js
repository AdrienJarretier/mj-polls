'use strict';

module.exports = function (opts) {

    let exports = {};

    const common = require("../common.js");

    const config = common.serverConfig;

    const Database = require('better-sqlite3');

    let verboseFun = null;
    if (opts.verbose)
        verboseFun = console.log;

    function connect() {

        if (config.db.database == ':memory:')
            return new Database(common.dbBuffer, { verbose: verboseFun });
        else
            return new Database(config.db.database, { verbose: verboseFun });
    }

    function close(db) {

        if (config.db.database == ':memory:') {
            common.dbBuffer = db.serialize();
        }

        db.close();
    }

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

        const db = connect();

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


        close(db);

        return arrayOfResults;

    }

    function prepareAndExecute(db, sqlString, executionMethod, bindParameters, expand) {

        bindParameters = bindParameters || [];
        expand = expand || false;

        const stmt = db.prepare(sqlString);

        return _executePrepared(stmt, executionMethod, bindParameters, expand);

    }

    function executeStatement(sqlString, executionMethod, bindParameters, expand) {

        const db = connect();

        let results = prepareAndExecute(db, sqlString, executionMethod, bindParameters, expand);

        close(db);

        return results;

    }

    exports.connect = connect;
    exports.close = close;
    exports.prepareAndExecute = prepareAndExecute;
    exports.executeStatement = executeStatement;
    exports.executeLoop = executeLoop;

    return exports;

};