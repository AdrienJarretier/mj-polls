"use strict"

import {get } from '/javascripts/utils.js';

class LocaleMessages {

    /**
     * 
     * @param {string} part the part of the app to load messages for (or the page)
     * e.g : "header", "home"
     * @param {string} locale e.g "fr-FR"
     * @returns {Object} Object containing messages
     */
    static async new(part, locale) {
        const data = await get('/locales/' + part + '/' + locale);
        // console.log(data);
        return new LocaleMessages(data);
    }

    constructor(msgs) {
        this._msgs = msgs;
        for (let [k, v] of Object.entries(this._msgs)) {
            if (typeof(v) == 'object') {
                this._msgs[k] = new LocaleMessages(v);
            }
        }
    }

    get(key, params) {

        // params can be passed and will substitute inside template strings got from localeMessages.
        params = params || {};

        function _eval(value) {
            // console.log('typeof value:')
            // console.log(typeof value)
            if (typeof value == 'object') {
                for (const key in value) {
                    // console.log('key :', key)
                    value[key] = _eval(value[key]);
                }
                return value;
            } else {
                return eval('`' + value + '`');
            }
        }

        try {

            const rawVal = this._msgs[key];

            if (!rawVal)
                throw 'key "' + key + '" is ' + rawVal;

            // console.log('rawVal:')
            // console.log(rawVal)
            const evaluated = _eval(rawVal);
            // console.log('evaluated:')
            // console.log(evaluated)
            return evaluated
        } catch (e) {
            console.error(this._msgs[key]);
            console.error(e);
        }
    }
}

export { LocaleMessages };