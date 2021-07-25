'use strict';

function get_voters_count(choices) {
    var choice = choices[0];
    var votes = choice.votes;
    var VOTERS_COUNT = 0;
    for (const vote of Object.keys(votes)) {
        VOTERS_COUNT += votes[vote].count;
    }
    return (VOTERS_COUNT);
}


function get_majority(VOTERS_COUNT) {
    var majority;
    if (VOTERS_COUNT % 2 == 0) {
        majority = VOTERS_COUNT / 2
    }
    else {
        majority = (VOTERS_COUNT + 1) / 2
    }
    return (majority);
}


function get_majority_line_for_plot(VOTERS_COUNT) {
    var majority;
    if (VOTERS_COUNT % 2 == 0) {
        majority = (VOTERS_COUNT - 1) / 2
    }
    else {
        majority = VOTERS_COUNT / 2
    }
    return (majority);
}

function compare(a, b) {
    if (a.majority_grade_order < b.majority_grade_order) {
        return 1;
    }
    if (a.majority_grade_order > b.majority_grade_order) {
        return -1;
    }
    return 0;
}

function get_majority_grades(choices, majority) {
    // funtion that addes to choices the majority grade of each candidate, and its order
    for (const choice of choices) {

        var votes = choice.votes;
        var cpt = 0;

        for (const vote of Object.keys(votes).reverse()) {

            cpt += votes[vote].count;
            var entry;

            if (cpt >= majority) {

                choice["majority_grade"] = votes[vote].value;
                choice["majority_grade_order"] = votes[vote].order;
                break;

            }
        }
    }
    //reordering choices according to their majority grades
    choices.sort(compare);
}


$(async function () {


});
