'use strict';

import Table from '/javascripts/Table.js';
import { submitHandler } from '/javascripts/postPollCreation.js';
import { LocaleMessages } from "/javascripts/LocaleMessages.js";
let localeMsgs = await LocaleMessages.new('client-createPoll');

var choices = 0;

function makePollCreationForm(duplicateCheckMethods, grades) {

    let pollTable = new Table();
    pollTable.addClass('text-center');

    // console.log('rows', pollTable.rows);
    // console.log('rows', pollTable.rows);

    pollTable.addRow();
    for (let i = 0; i < grades.length; ++i) {

        pollTable.addRow(grades[i].value);
    }

    // ---------------------------------------------------------------
    // ------------------------ Choices inputs -----------------------

    let emptyInputs = {
        v: 0,
        inc() {
            ++this.v;
            // console.log('emptyInputs', this.v);
        },
        dec() {
            --this.v;
            // console.log('emptyInputs', this.v);
        }
    };

    let scrollPos = 0;
    let inputWidth = 0;

    function addChoiceInput(duration) {

        let choiceInput = $(`<input name="choices[]" type="text"
        class="form-control text-center">`)
            .data('empty', true);

        choiceInput.on('input', function() {

            const re = /\S+/;
            const matched = $(this).val().match(re);

            // console.log('input');

            if (matched) {
                if ($(this).data('empty')) {
                    $(this).data('empty', false);
                    emptyInputs.dec();
                    if (emptyInputs.v == 0) {
                        addChoiceInput('slow');
                    }
                }
            } else {
                if (!$(this).data('empty')) {

                    // let inputToFocus = $(this).parent().siblings().last().children();
                    let inputToFocus = $(this).parent().next().children();
                    // console.log(inputToFocus);
                    inputToFocus.focus();
                    pollTable.removeCol($(this).parent().index(), 'slow');
                    scrollPos -= inputWidth;
                }
            }

        });

        let clonedInput = choiceInput.clone(true);
        pollTable.addCol(clonedInput, true, duration);
        pollTable.rawTable.parent().animate({ scrollLeft: scrollPos }, 'slow');
        scrollPos += inputWidth;

        emptyInputs.inc();

        for (let i = 1; i < pollTable.rows; ++i) {
            pollTable.setContent(i, pollTable.cols - 1,
                $('<input type="radio" disabled>')
            );
        }

        return clonedInput;
    }

    // console.log('rows', pollTable.rows);
    // console.log(pollTable.cols);

    // ---------------------------------------------------------------
    // ------------------------ Submit Button ------------------------

    let divSubmitButton = $('<div>')
        .addClass('d-grid col-6 mx-auto my-3 mt-4');

    let submitButton = $('<button type="submit" id="submitButton">')
        .addClass("btn")
        .addClass("btn-secondary")

    submitButton.text(localeMsgs.get('submitButton'));

    divSubmitButton.append(submitButton);

    // ----------------------------------------------------------------
    // ------------------------- poll options -------------------------

    let divPollOptions = $('<div>')
        .addClass('d-grid col-6 mx-auto mt-3 mb-2');

    // ----------------------------------------------------------------
    // ------------------------ Max Date Input ------------------------

    const maxDatetimeLabelText = localeMsgs.get('maxDateLabel');
    const maxDatetimeInputId = 'maxDatetime';
    const maxDatetimeInput = $('<div class="form-floating">')
        .append(
            $('<input type="datetime-local" class="form-control" >')
            .attr('name', maxDatetimeInputId)
            .attr('id', maxDatetimeInputId)
        )
        .append(
            $('<label class="form-label">')
            .attr('for', maxDatetimeInputId)
            .text(maxDatetimeLabelText)
        );

    divPollOptions.append(maxDatetimeInput);

    // ---------------------------------------------------------------
    // ---------------------------------------------------------------

    // divPollOptions.append('<hr>');

    // ---------------------------------------------------------------
    // ---------------------------------------------------------------

    const form = $('#choicesForm');

    function formNewLine(lineContent) {

        let col = $('<div>')
            .append(lineContent);

        col.addClass('col');

        let line = $('<div class="row">')
            .append(col);

        form.append(line);
        return line;
    }

    formNewLine(pollTable.rawResponsiveDiv);
    formNewLine(divPollOptions);
    formNewLine(divSubmitButton);

    form.submit(submitHandler);

    inputWidth = Math.ceil(parseFloat(addChoiceInput().parent().css("width")));
}

export default makePollCreationForm;