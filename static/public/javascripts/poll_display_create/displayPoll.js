'use strict';

import Table from '/javascripts/Table.js';
import { LocaleMessages } from "/javascripts/LocaleMessages.js";
import { parseForm, post } from '/javascripts/utils.js';

let localeMsgs = await LocaleMessages.new('client-poll');

// console.log(pollJSONstr);

function hasVoted(hasVoted, infiniteVoteEnabled) {

    if (infiniteVoteEnabled == undefined)
        throw 'infiniteVoteEnabled is undefined';

    if (hasVoted && !infiniteVoteEnabled) {

        $('#choicesForm').hide();
        $('#hasVotedAlert').show();

        $('main').append(`
        <div class="alert alert-success" role="alert" id="hasVotedAlert">
          <h2 class="alert-heading">` + localeMsgs.get('hasVotedPopup').get('title') + `</h2>
          <p>` + localeMsgs.get('hasVotedPopup').get('body') + `</p>
        </div>
        `);

    } else {

        $('#hasVotedAlert').hide();
    }
}

function displayPoll(parsedPoll, infiniteVoteEnabled, grades) {

    let pollTable = new Table();

    async function newMakeVoteForm() {

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

    // console.log(localStorage.getItem(parsedPoll.identifier));

    if (!localStorage.getItem(parsedPoll.identifier) || infiniteVoteEnabled) {
        newMakeVoteForm(parsedPoll);
        hasVoted(false, infiniteVoteEnabled);
    } else {
        pollTable.addCol();
        for (let choice of parsedPoll.choices) {
            pollTable.addCol(choice.name);
        }
        hasVoted(true, infiniteVoteEnabled);
    }

    // ---------------------------------------------------------------
    // ------------------------ Results Button ------------------------

    if (parsedPoll.max_voters === null && parsedPoll.max_datetime === null) {
        $('#toResultsButton')
            .append($('<a>').attr('href', '/poll_results/' + parsedPoll.identifier).append($('<button class="btn btn-secondary">')
                .text(localeMsgs.get('toResultsLink'))));

    } else if (parsedPoll.max_datetime !== null) {

        const maxDate = new Date(parsedPoll.max_datetime);

        const maxDateStr = maxDate.toLocaleDateString(localeCode);
        const maxTimeStr = maxDate.toLocaleTimeString(localeCode, { hour: '2-digit', minute: '2-digit' });

        $('#toResultsButton').text(localeMsgs.get('closingDateTime', {
            date: maxDateStr,
            time: maxTimeStr,
        }));
    }

    // ---------------------------------------------------------------
    // ---------------------------------------------------------------

    // ---------------------------------------------------------------
    // ------------------------ Submit Button ------------------------

    let divSubmitButton = $('<div>')
        .addClass('d-grid mx-auto');

    let submitButton = $('<button type="submit" id="submitButton">')
        .addClass("btn")
        .addClass("btn-success")
        .text(localeMsgs.get('submitButton'));

    divSubmitButton.append(submitButton);

    // ---------------------------------------------------------------
    // ---------------------------------------------------------------

    // ---------------------------------------------------------------
    // ------------------------ Share Button ------------------------

    const windowLocOrig = window.location.origin;
    const pollLinkVal = windowLocOrig + '/poll/' + parsedPoll.identifier

    const copiedSuccessAlert = $(`<div class="alert alert-primary p-0 mb-0" role="alert">`)
        .text('Lien copié !')
        .fadeTo(0, 0);

    const linkInput = $('<input type="text" class="form-control form-control-sm">')
        .attr('readonly', true)
        .val(pollLinkVal)
        .select(function() {});

    const popoverContent = $('<div class="container">')
        .append(
            $('<div class="row">')
            .append(
                $('<div class="col p-0">')
                .append(copiedSuccessAlert)
            )
        )
        .append(
            $('<div class="row">')
            .append(
                $('<div class="col p-0">')
                .append(
                    linkInput
                )
            )
            .append(
                $('<div class="col pe-0 text-end copyBtnCol">')
                .append($('<button type="button" class="btn btn-secondary btn-sm popoverButton">')
                    .text('copier')
                    .click(function() {
                        linkInput.select();
                        navigator.clipboard.writeText(pollLinkVal).then(function() {
                            copiedSuccessAlert
                                .fadeTo(0, 1)
                                .fadeTo(2400, 0);
                        }, function() {
                            console.error('select event on pollLinkVal error');
                        });
                    })
                )
            )
        );

    let divShareButton = $('<div>')
        .addClass('d-grid col-6');

    let shareButton = $(`<button type="button" id="shareButton">`)
        .attr('data-bs-container', 'body')
        .attr('data-bs-toggle', 'popover')
        .attr('data-bs-placement', 'bottom')
        .addClass("btn")
        .addClass("btn-secondary")
        .append($(`<i class="bi-share-fill" role="img"
        aria-label="Share">
        </i>`))
        .append('Partager')

    divShareButton.append(shareButton);

    new bootstrap.Popover(shareButton, {
        container: 'body',
        html: true,
        sanitize: false,
        content: popoverContent,
        offset: [-200, 8],
        customClass: 'sharePopover'
    })

    $('main')
        .append($('<div class="row">')
            .append($('<div class="col">'))
            .append($('<div class="col-4">'))
            .append($('<div class="col text-end">')
                .append(shareButton)
            )
        );

    // ---------------------------------------------------------------
    // ---------------------------------------------------------------

    $('#choicesForm')
        .append($('<div class="row">')
            .append($('<div class="col">')
                .append(pollTable.rawResponsiveDiv)
            )
        )
        .append($('<div class="row my-3">')
            .append($('<div class="col">'))
            .append($('<div class="col-4">')
                .append(divSubmitButton)
            )
            .append($('<div class="col text-end">'))
        )
        .submit(async function(event) {
            event.preventDefault();

            let formData = parseForm($(this));

            let postResponse = await post(
                '/polls/' + parsedPoll.identifier + '/vote',
                formData
            );

            submitButton.attr('disabled', true);
            $(this).find('input').attr('disabled', true);
            if (postResponse.voteSuccessfull) {

                submitButton.text('Vote validé !');

                localStorage.setItem(parsedPoll.identifier, true);

                hasVoted(true, infiniteVoteEnabled);

            } else {

                submitButton.text('Erreur');
                submitButton
                    .removeClass("btn-success")
                    .addClass("btn-danger");
            }

        });

}

export { displayPoll };