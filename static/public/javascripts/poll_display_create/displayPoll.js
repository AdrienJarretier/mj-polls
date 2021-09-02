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

function displayPoll(parsedPoll, infiniteVoteEnabled) {

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

    $('#choicesForm')
        .append($('<div class="row">')
            .append($('<div class="col">')
                .append(pollTable.rawResponsiveDiv)
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
}

export { displayPoll };
