"use strict";

const fs = require('fs');
const local_config_loader = require('env-config-prompt');

const serverConfig = JSON.parse(fs.readFileSync('config.json', 'utf8'));
const local_config = local_config_loader(false,'localConfig.json','localConfig_template.json','server config');
Object.assign(serverConfig, local_config);

// console.log(JSON.stringify(serverConfig, null, 4));
// console.log()


exports.serverConfig = serverConfig;
