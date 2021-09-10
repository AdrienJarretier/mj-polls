"use strict"

/**
 * 
 * @param {string} part the part of the app to load messages for (or the page)
 * e.g : "header", "home"
 * @param {string} locale e.g "fr-FR"
 * @returns {Object} Object containing messages
 */
async function loadMessages(part, locale) {
    return await get('/polls/locale/' + part + '/' + locale);
}

export { loadMessages };