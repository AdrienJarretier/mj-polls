'use strict';

async function get(uri) {

    try {

        const response = await fetch(uri, {
            method: 'GET',
        });

        return await response.json();

    } catch (e) {

        return [];

    }

}

async function post(uri, data) {

    const response = await fetch(uri, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    return await response.json();

}

async function put(uri, data) {

    const response = await fetch(uri, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    return await response.json();

}

async function sendDelete(uri, data) {

    const response = await fetch(uri, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    return await response.json();

}


function monitorEvents(element) {

    var log = function(e) { console.log(e); };
    var events = [];

    for (var i in element) {
        if (i.startsWith("on")) events.push(i.substr(2));
    }
    events.forEach(function(eventName) {
        element.addEventListener(eventName, log);
    });
}

function parseForm(formSelector) {

    let formData = {};

    let serializedFOrm = $(formSelector).serializeArray();

    // console.log(serializedFOrm);

    for (let field of serializedFOrm) {

        let name = field.name;

        if (name.endsWith('[]')) {

            name = name.slice(0, -2);

            if (!(name in formData)) {

                formData[name] = []

            }
            formData[name].push(field.value);

        } else {
            formData[name] = field.value;
        }

    }

    return formData;

}

function formatDate(date) {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

function formatTime(date) {

    let h = date.getUTCHours().toString(),
        m = date.getUTCMinutes().toString(),
        s = date.getUTCSeconds().toString();

    if (h.length < 2)
        h = '0' + h;

    if (m.length < 2)
        m = '0' + m;

    if (s.length < 2)
        s = '0' + s;

    return [h, m, s].join(':');
}

function formatDateTime(date) {

    return formatDate(date) + ' ' + formatTime(date);
}

function cloneTemplate(templateId) {

    return $($('#' + templateId)[0].content.cloneNode(true).children);
}

// use 'await sleep(duration);'
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

function stringSplitter(str, l){
    var strs = [];
    while(str.length > l){
        var pos = str.substring(0, l).lastIndexOf(' ');
        pos = pos <= 0 ? l : pos;
        strs.push(str.substring(0, pos));
        var i = str.indexOf(' ', pos)+1;
        if(i < pos || i > pos+l)
            i = pos;
        str = str.substring(i);
    }
    strs.push(str);
    return strs;
}

export {get, parseForm, post, formatDateTime, stringSplitter};