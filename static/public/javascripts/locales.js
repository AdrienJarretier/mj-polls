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
            // console.log('rawVal:')
            // console.log(rawVal)
            const evaluated = _eval(rawVal);
            // console.log('evaluated:')
            // console.log(evaluated)
            return evaluated
        }
        catch (e) {
            console.error(this._msgs[key]);
            console.error(e);
        }
    }
}

export { LocaleMessages };