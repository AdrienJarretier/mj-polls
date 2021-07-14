"use strict";

const dbUtils = require('./dbUtils.js');

let executeStatement = dbUtils.executeStatement;

exports.getAll = function () {

    let products = {}

    for (let p of executeStatement(`
    SELECT *
    FROM products 
    INNER JOIN units ON products.unit_id = units.id ; `
        , null, 'all', true)) {

        products[p.products.id] = p

    }

    return products;

}
