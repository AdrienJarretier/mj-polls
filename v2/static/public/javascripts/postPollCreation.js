import { parseForm, post } from '/javascripts/utils.js';

function toDateTime(date, time) {

    if ((!date || date == '') && (!time || time == ''))
        return null;
    else {

        let dateObject = (date != '' ? new Date(date) : new Date());

        if (time != '') {

            let timeSplit = time.split(':');
            dateObject.setHours(timeSplit[0]);
            dateObject.setMinutes(timeSplit[1]);
        }
        return formatDateTime(dateObject);
    }
}

function prepareFormData(formData) {

    formData.max_datetime = toDateTime(formData.maxDate, formData.maxTime);
    delete formData.maxDate;
    delete formData.maxTime;
}

async function submitHandler(event) {
    event.preventDefault();


    let formData = parseForm('form');

    prepareFormData(formData);

    let pollId = await post('/polls', formData);

    // console.log(pollId);

    window.location.href = '/poll/' + pollId;

}

export { submitHandler };