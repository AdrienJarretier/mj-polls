// ------------------------------------------------------ REQUIRE
var express = require('express');
var router = express.Router();

// parse application/json

const common = require('../common.js');

// --------------------------------------------------------------

router.get('/:part/:locale', function (req, res) {

    const parts = req.params.part.split('-');

    let localeMsgs = common.localesMsgs[req.params.locale];

    for (const part of parts) {
        localeMsgs = localeMsgs[part];
    }
    res.json(localeMsgs);

});

module.exports = router
