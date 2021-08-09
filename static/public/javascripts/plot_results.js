'use strict';

// Palettes definition
// const COLORS_7 = [
//     "#df8568", "#F7A578", "#FBC789", "#FBD989", "#c1dbb3", "#7ebc89", "#54a062"
// ];

// new color palette


$(async function () {

    var choices = parsedPoll["choices"];


    const VOTERS_COUNT = get_voters_count(choices);
    // const majority_plot = get_majority(VOTERS_COUNT);

    // ranking candidates according to the votes
    const ranking = order_candidates(choices);

    mapOrder(choices, ranking, 'name');

    const outcome = detect_outcome(choices, ranking);

    console.log(choices);
    console.log(get_majority(VOTERS_COUNT));

    draw_global_results(choices);

    $('#title').text('Graphical results for poll : ' + parsedPoll.title);
    $('#results_alert_text').text("    " + outcome);

    draw_candidate_results(choices, choices[0].name);


});


