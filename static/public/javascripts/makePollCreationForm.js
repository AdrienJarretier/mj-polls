'use strict';

var choices = 0;

$(async function () {

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

});
