"use strict";

const fs = require('fs');
const local_config_loader = require('env-config-prompt');
var path = require('path');

const Random = require('random-js');
const nodeCryptoGen = Random.nodeCrypto;

const serverConfig = JSON.parse(
    fs.readFileSync(
        path.resolve(__dirname, 'config.json'),
        'utf8'
    )
);

serverConfig.db.database = path.resolve(__dirname, serverConfig.db.database);

const local_config = local_config_loader(false, path.resolve(__dirname, 'localConfig.json'), path.resolve(__dirname, 'localConfig_template.json'), 'server config');
Object.assign(serverConfig, local_config);

// console.log(JSON.stringify(serverConfig, null, 4));
// console.log()


exports.serverConfig = serverConfig;

exports.randomUUID = function () {
    return Random.uuid4(nodeCryptoGen);
}

exports.localesMsgs = {}

for (let locale of ['fr-FR']) {
    exports.localesMsgs[locale] = {};
    for (let part of ['client', 'db']) {

        const filename = path.resolve(
            __dirname, 'locales', locale, part + '.json'
        );
        console.log(filename);

        exports.localesMsgs[locale][part] =
            fs.readFileSync(
                filename
                ,
                'utf8'
            );
    }
}
