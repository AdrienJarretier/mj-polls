"use strict";

const common = require("../common.js");

const config = common.serverConfig;

const Database = require('better-sqlite3');

const fs = require('fs');


function createDb() {

    const db = new Database(config.db.database, { verbose: console.log });

    db.exec(`CREATE TABLE IF NOT EXISTS "grades" (
        "id" INTEGER PRIMARY KEY,
        "value" VARCHAR(255) NOT NULL UNIQUE,
        "order" INTEGER NOT NULL UNIQUE
        );`);

    db.exec(`INSERT INTO grades("value", "order") VALUES('Excellent', 0);`);
    db.exec(`INSERT INTO grades("value", "order") VALUES('Passable', 500);`);
    db.exec(`INSERT INTO grades("value", "order") VALUES('Bad', 1000);`);

    // Polls will close when either voters_count > max_voters
    // or max_date has been exceeded
    db.exec(`CREATE TABLE IF NOT EXISTS "polls" (
        "id" INTEGER PRIMARY KEY,
        "title" VARCHAR(255) NOT NULL,
        "voters_count" INTEGER DEFAULT 0,
        "max_voters" INTEGER,
        "max_datetime" DATETIME,
        "datetime_opened" DATETIME DEFAULT CURRENT_TIMESTAMP,
        "datetime_closed" DATETIME
        );`);

    db.exec(`CREATE TABLE IF NOT EXISTS "polls_choices" (
        "id" INTEGER PRIMARY KEY,
        "poll_id" INTEGER NOT NULL,
        "name" VARCHAR(255) NOT NULL,
        FOREIGN KEY(poll_id) REFERENCES polls(id),
        UNIQUE(poll_id,name)
        );`);

    db.exec(`CREATE TABLE IF NOT EXISTS "polls_votes" (
        "poll_id" INTEGER NOT NULL,
        "grade_id" INTEGER NOT NULL,
        "count" INTEGER DEFAULT 0,
        FOREIGN KEY(poll_id) REFERENCES polls(id),
        FOREIGN KEY(grade_id) REFERENCES grades(id),
        UNIQUE(poll_id,grade_id)
        );`);

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
