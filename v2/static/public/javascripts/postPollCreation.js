import { parseForm, post, formatDateTime } from '/javascripts/utils.js';

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

    formData.max_datetime = formData.maxDatetime;

    // const splitDate = formData.maxDatetime.split('T');
    // formData.max_datetime = toDateTime(splitDate[0], splitDate[1]);

    delete formData.maxDatetime;
}

async function submitHandler(event) {
    event.preventDefault();

    let formData = parseForm('form');

    prepareFormData(formData);
    // console.log(formData);
    // throw '';

    let pollId = await post('/polls', formData);

    // console.log(pollId);

    window.location.href = '/poll/' + pollId;

}

export { submitHandler };