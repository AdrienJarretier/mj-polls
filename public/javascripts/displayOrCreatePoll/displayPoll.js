'use strict';

// console.log(pollJSONstr);

const parsedPoll = JSON.parse(pollJSONstr);
const infiniteVoteEnabled = JSON.parse(infiniteVoteEnabledStr);

function hasVoted(hasVoted) {

    if (hasVoted && !infiniteVoteEnabled) {

        $('#choicesForm').hide();
        $('#hasVotedAlert').show();

    } else {

        $('#hasVotedAlert').hide();
    }
}

async function makeVoteForm() {

    let grades = await get('/polls/grades');

    for (let grade of grades.sort((a, b) => b.order - a.order)) {

        let row = $('<div>').addClass('row');
        let col = cloneTemplate('firstColTemplate');
        // console.log($(col));
        // console.log($('<div>').addClass('col'));
        // console.log('-------');
        // row.append($('<div>').addClass('col').text(grade.value));
        // col.append(grade.value);
        row.append(col.text(grade.value));

        for (let choice of parsedPoll.choices) {

            let col = $('<div>').addClass('col');
            let radioBtn = $('<input type="radio" required>')
                .attr('name', choice.id)
                .attr('value', grade.id);

            col.append(radioBtn);
            row.append(col);

        }

        $('#choicesForm').append(row);

    }

    let divSubmitButton = $('<div>')
        .addClass('d-grid col-6 mx-auto');

    let submitButton = $('<button type="submit" id="submitButton">')
        .addClass("btn")
        .addClass("btn-secondary")
        .text('Vote')

    divSubmitButton.append(submitButton);

    $('#choicesForm').append(divSubmitButton)
        .submit(async function (event) {
            event.preventDefault();

            let formData = parseForm($(this));

            console.log(formData);

            let voteOk = await post(
                '/polls/' + parsedPoll.id + '/vote',
                formData
            );

            console.log(voteOk);

            if (voteOk) {

                localStorage.setItem(parsedPoll.id, true);

                hasVoted(true);

            }

        });


}

$(async function () {

    $('#title').text(parsedPoll.title);

    let row = $('#choices');
    for (let choice of parsedPoll.choices) {

        row.append($('<div>').addClass('col').text(choice.name));

    }
    $('#choices').append(row);


    if (!localStorage.getItem(parsedPoll.id) || infiniteVoteEnabled) {

        makeVoteForm();
        hasVoted(false);
    }
    else {
        hasVoted(true);
    }

    if (parsedPoll.max_voters === null && parsedPoll.max_datetime === null) {
        $('#toResultsButton')
            .append($('<a>').attr('href', '/poll_results/' + parsedPoll.id).append($('<button class="btn btn-secondary">')
                .text('To Results'))
            );
    }

});
