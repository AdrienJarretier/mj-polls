'use strict';

import Table from '/javascripts/Table.js';
import { submitHandler } from '/javascripts/postPollCreation.js';

var choices = 0;

function old(duplicateCheckMethods) {

    function addChoiceInput() {

        let choiceInput = $('#choiceInputTemplate')[0].content;

        let cloned = $(choiceInput.cloneNode(true));

        // console.log($(cloned.children().children()[0]).attr('for'));

        let label = cloned.children().children().eq(0);
        let input = cloned.children().children().eq(1);

        // console.log(input);

        let idAttr = input.attr('id');
        // console.log(idAttr);

        ++choices;
        label.attr('for', idAttr + choices);
        input.attr('id', idAttr + choices);
        label.text(choices);

        $('#choices').append(cloned);

    }


    function removeChoiceInput() {

        $('#choices').children().last().remove();
        --choices;

    }

    function updateChoicesInputs() {

        let requestedChoices = $('#addChoice').val();

        if (requestedChoices >= 0) {

            while (choices < requestedChoices) {

                addChoiceInput();

            }

            while (choices > requestedChoices) {

                removeChoiceInput();

            }
        }

    }

    $('#addChoice').change(updateChoicesInputs);

    updateChoicesInputs();

    // -------------------------------
    // fill select : duplicate vote check methods
    // -------------------------------

    for (let method of duplicateCheckMethods) {

        let duplicateCheckMethodOption = $('<option>')
            .attr('value', method.id)
            .text(method.name);

        $('#duplicateCheckMethod').append(duplicateCheckMethodOption);

    }

    // ------------------------------------------------

    $('#inputMaxDate')
        .attr('min', formatDate(new Date()));

};

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

        choiceInput.on('input', function () {

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
                    console.log(inputToFocus);
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
        .addClass('d-grid col-6 mx-auto');

    let submitButton = $('<button type="submit" id="submitButton">')
        .addClass("btn")
        .addClass("btn-secondary")

    submitButton.text('Create Poll');

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
        .submit(submitHandler);

    inputWidth = Math.ceil(parseFloat(addChoiceInput().parent().css("width")));
    console.log(inputWidth);
}

export default makePollCreationForm;
