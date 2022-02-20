"use strict";

const db = require('./db.js');

console.log('-------------------- TEST --------------------');

console.log(db.getAll());

// db.insertUnit('Litre');
// db.insertUnit('Kg');
// db.insertProduct('lait', 1, 1, 12);

console.log(db.getAll());

console.log('------------------ FIN TEST ------------------');