
$(async function () {
    function toDateTime(date, time) {

        if (date == '' && time == '')
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

    $('form')
        .submit(async function (event) {
            event.preventDefault();


            let formData = parseForm('form');
            
            prepareFormData(formData);

            console.log(formData);

            let pollId = await post('/polls', formData);

            // console.log(pollId);

            // window.location.href = 'poll/' + pollId;

        });

});