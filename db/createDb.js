"use strict";

const common = require("../common.js");

const config = common.serverConfig;

const Database = require('better-sqlite3');

const db = new Database(config.db.database, { verbose: console.log });




db.exec(`CREATE TABLE IF NOT EXISTS "grades" (
    "id" INTEGER PRIMARY KEY,
    "value" VARCHAR(255) NOT NULL UNIQUE,
    "order" INTEGER NOT NULL UNIQUE
    );`);

db.exec(`INSERT INTO grades("value", "order") VALUES('Excellent', 0);`);
db.exec(`INSERT INTO grades("value", "order") VALUES('Passable', 500);`);
db.exec(`INSERT INTO grades("value", "order") VALUES('Bad', 1000);`);

//     db.exec(`CREATE TABLE IF NOT EXISTS "vote-results" (
//         "id" INTEGER PRIMARY KEY,
//         "name" VARCHAR(255) NOT NULL UNIQUE
//         );`);



// db.exec(`CREATE TABLE IF NOT EXISTS "units" (
//     "id" INTEGER PRIMARY KEY,
//     "name" VARCHAR(255) NOT NULL UNIQUE
//     );`);

// db.exec(`CREATE TABLE IF NOT EXISTS "products" (
//     "id" INTEGER PRIMARY KEY,
//     "name" VARCHAR(255) NOT NULL UNIQUE,
//     "unit_id" INTEGER NOT NULL,
//     "current" INTEGER,
//     "max" INTEGER,
//     FOREIGN KEY(unit_id) REFERENCES units(id)
//     );`);


db.close();

console.log('db closed');
console.log('db ' + config.db.database + ' created');
