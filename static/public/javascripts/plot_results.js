'use strict';

// Palettes definition
// const COLORS_7 = [
//     "#df8568", "#F7A578", "#FBC789", "#FBD989", "#c1dbb3", "#7ebc89", "#54a062"
// ];

// new color palette


$(async function () {

    var choices = parsedPoll["choices"];


    const VOTERS_COUNT = get_voters_count(choices);

    // ranking candidates according to the votes

    const ranking = order_candidates(choices);

    mapOrder(choices, ranking, 'name');

    const outcome = detect_outcome(choices, ranking);

    console.log(choices);
    console.log(get_majority(VOTERS_COUNT));

    draw_global_results(choices);

    $('#title').text('Graphical results for poll : ' + parsedPoll.title);
    $('#results_alert_text').text("    " + outcome);


    // define radio buttons to select a candidate

    for (var choice of choices) {

        const id = "radio_btn_candidate_selection_" + choice.name;

        let radio_group = $('#Candidate_choice')

        let checked = false;

        if (choice.name == ranking[0]) {
            checked = true;
        }

        let radio_btn = $('<input>').prop({
            type: 'radio',
            id: id,
            name: "radio_btn_candidate_selection",
            class: "btn-check",
            autocomplete: "off",
            checked: checked,
            value: choice.name
        });

        radio_group.append(radio_btn);

        radio_group.append(
            $('<label>').prop({
                for: id,
                class: "btn btn-lg btn-outline-secondary"
            }).text(choice.name)
        )
    }

    $('#formRadiosCandidate_selection').change(function (e) {
        update_candidate_results(choices, $(e.target).val());
    })

    // graph with a focus on the chosen candidate

    draw_candidate_results(choices, $("input:radio[name='radio_btn_candidate_selection']:checked").val());


});


