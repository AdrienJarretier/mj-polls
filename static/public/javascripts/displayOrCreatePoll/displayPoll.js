'use strict';

import Table from '/javascripts/Table.js';

// console.log(pollJSONstr);

function hasVoted(hasVoted, infiniteVoteEnabled) {

    if (infiniteVoteEnabled == undefined)
        throw 'infiniteVoteEnabled is undefined';

    if (hasVoted && !infiniteVoteEnabled) {

        $('#choicesForm').hide();
        $('#hasVotedAlert').show();

    } else {

        $('#hasVotedAlert').hide();
    }
}

async function makeVoteForm(parsedPoll) {

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

function oldDisplayPoll(pollJSONstr, infiniteVoteEnabledStr) {

    const parsedPoll = JSON.parse(pollJSONstr);
    const infiniteVoteEnabled = JSON.parse(infiniteVoteEnabledStr);

    $('#title').text(parsedPoll.title);

    let row = $('#choices');

    parsedPoll.choices.sort((a, b) => a.name.localeCompare(b.name));
    for (let choice of parsedPoll.choices) {

        row.append($('<div>').addClass('col').text(choice.name));

    }
    $('#choices').append(row);


    if (!localStorage.getItem(parsedPoll.id) || infiniteVoteEnabled) {

        makeVoteForm(parsedPoll);
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
}

function newDiplayPoll(pollJSONstr, infiniteVoteEnabledStr) {

    const parsedPoll = JSON.parse(pollJSONstr);
    const infiniteVoteEnabled = JSON.parse(infiniteVoteEnabledStr);
    let pollTable = new Table();

    async function newMakeVoteForm() {

        let grades = await get('/polls/grades');
        grades.sort((a, b) => b.order - a.order);

        pollTable.addCol();
        for (let choice of parsedPoll.choices) {
            pollTable.addCol(choice.name);
        }
        for (let i = 0; i < grades.length; ++i) {

            pollTable.addRow(grades[i].value);

            for (let j = 0; j < parsedPoll.choices.length; ++j) {

                let radioBtn = $('<input type="radio" required>')
                    .attr('value', grades[i].id)
                    .attr('name', parsedPoll.choices[j].id);

                pollTable.setContent(i + 1, j + 1, radioBtn);
            }
        }
    }

    $('#title').text(parsedPoll.title);

    pollTable.setUniformColsWidth(true);
    pollTable.addClass('text-center');

    parsedPoll.choices.sort((a, b) => a.name.localeCompare(b.name));

    if (!localStorage.getItem(parsedPoll.id) || infiniteVoteEnabled) {
        newMakeVoteForm(parsedPoll);
        hasVoted(false, infiniteVoteEnabled);
    }
    else {
        pollTable.addCol();
        for (let choice of parsedPoll.choices) {
            pollTable.addCol(choice.name);
        }
        hasVoted(true, infiniteVoteEnabled);
    }

    if (parsedPoll.max_voters === null && parsedPoll.max_datetime === null) {
        $('#toResultsButton')
            .append($('<a>').attr('href', '/poll_results/' + parsedPoll.id).append($('<button class="btn btn-secondary">')
                .text('To Results'))
            );
    }

    // ---------------------------------------------------------------
    // ------------------------ Submit Button ------------------------

    let divSubmitButton = $('<div>')
        .addClass('d-grid col-6 mx-auto');

    let submitButton = $('<button type="submit" id="submitButton">')
        .addClass("btn")
        .addClass("btn-secondary")
        .text('Vote')

    divSubmitButton.append(submitButton);

    // ---------------------------------------------------------------
    // ---------------------------------------------------------------

    let pollForm =
        $('<form id="choicesForm">')
            .append($('<div class="row">')
                .append($('<div class="col">')
                    .append(pollTable.responsiveDiv)
                )
            )
            .append($('<div class="row my-3">')
                .append($('<div class="col">')
                    .append(divSubmitButton)
                )
            )
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

                    hasVoted(true, infiniteVoteEnabled);

                }

            });;

    return pollForm;
}

export default newDiplayPoll;
