"use strict";

const common = require("../common.js");

const config = common.serverConfig;

const Database = require('better-sqlite3');

const fs = require('fs');
var path = require('path');

// Polls will close when either voters_count > max_voters
// or max_date has been exceeded

function createDb() {

    const db = new Database(config.db.database, { verbose: console.log });

    const sqlSchema = fs.readFileSync(
        path.resolve(__dirname, 'dbSchema.sql'),
        'utf8'
    );

    const sqlInitFill = fs.readFileSync(
        path.resolve(__dirname, 'dbInitFill.sql'),
        'utf8'
    );

    db.exec(sqlSchema);
    db.exec(sqlInitFill);

    db.close();

    console.log('db closed');
    console.log('db ' + config.db.database + ' created');

}


try {
    if (fs.existsSync(config.db.database)) {

        const readline = require("readline").createInterface({
            input: process.stdin,
            output: process.stdout
        });

        readline.question("db already exists, overwrite it ? (y/[n])", answer => {
            if (answer.toLowerCase() == "y") {
                fs.rmSync(config.db.database);
                createDb();
            }
            else {
                console.log("Database already exists, aborting creation.")
            }
            readline.close();
        });

    } else {
        createDb();
    }

} catch (err) {
    console.error(err)
}
