"use strict"

class LocaleMessages {

    static async new(part, locale) {
        return new LocaleMessages(await get('/polls/locale/' + part + '/' + locale));
    }

    /**
     * 
     * @param {string} part the part of the app to load messages for (or the page)
     * e.g : "header", "home"
     * @param {string} locale e.g "fr-FR"
     * @returns {Object} Object containing messages
     */
    constructor(msgs) {
        this._msgs = msgs;
    }

    get(key, params) {
        try {
            const value = this._msgs[key];
            console.log(typeof value);
            const evaluatedVal = eval('`' + value + '`');
            console.log(evaluatedVal);
            return evaluatedVal
        }
        catch(e) {
            console.error(this._msgs[key]);
            console.error(e);
        }
    }
}

export { LocaleMessages };