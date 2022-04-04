"use strict"

import {get } from '/javascripts/utils.js';

class LocaleMessages {

    static availableLanguages = [
        ['en', 'English'],
        ['fr', 'Français']
    ];
    static currentLocale;
    static urlLangPattern;
    static {

        this.urlLangPattern = '^\/(' + this.availableLanguages[0][0];
        for (let i = 1; i < this.availableLanguages.length; ++i) {
            const lang = this.availableLanguages[i][0];
            this.urlLangPattern += '|' + lang;
        }
        this.urlLangPattern += ')';

        this.currentLocale = window.location.pathname.match(
            this.urlLangPattern
        )[1];
    }

    /**
     * 
     * @param {string} part the part of the app to load messages for (or the page)
     * e.g : "header", "home"
     * @param {string} locale e.g "fr-FR"
     * @returns {Object} Object containing messages
     */
    static async new(part, locale = this.currentLocale) {
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

        // console.log('get ',key,'params :', params);
        function _eval(value) {
            // console.log('typeof value:')
            // console.log(typeof value)
            // console.log('_eval value :', value);
            // console.log('_eval params :', params);
            if (typeof value == 'object') {
                // for (const key in value) {
                //     // console.log('key :', key)
                //     value[key] = _eval(value[key]);
                // }
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
            console.log();
            return evaluated
        } catch (e) {
            console.error(this._msgs[key]);
            console.error(e);
        }
    }
}

export { LocaleMessages };