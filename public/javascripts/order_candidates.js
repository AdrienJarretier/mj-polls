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

function get_majority_grades(choices, majority, for_ties) {

    for_ties = for_ties || false;


    // funtion that addes to choices the majority grade of each candidate, and its order
    for (const choice of choices) {

        var votes = choice.votes;
        var cpt = 0;

        for (const vote of Object.keys(votes).reverse()) {

            if (for_ties) {
                cpt += votes[vote].count_for_ties;

            }
            else {
                cpt += votes[vote].count;
                votes[vote].count_for_ties = votes[vote].count;
            }


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

function handle_ties(choices) {
    const winning_grade = choices[0].majority_grade;
    const ties = choices.filter(function (el) {
        return el.majority_grade == winning_grade;
    }
    )

    if (ties.length == 1) {
        console.log("No ties, the winner is : " + choices[0].name);
        return (choices[0].name);
    }
    else {
        console.log("There are " + ties.length + " ties");
        // removes one vote for each winning grade in the tied candidates
        console.log("before removing votes");
        console.log(ties);


        for (const choice of ties) {

            var votes = choice.votes;

            for (const vote of Object.keys(votes)) {

                if (votes[vote].value == winning_grade) {
                    votes[vote].count_for_ties -= 1;
                }

            }
        }
        console.log("after removing votes");

        console.log(ties);

        var VOTERS_COUNT = get_voters_count(ties);
        var majority = get_majority(VOTERS_COUNT);


        // see if there are still ties

        get_majority_grades(ties, majority, true);

        console.log("after reordering");

        console.log(ties);

        // handle_ties(ties);


        // adding new count field to be used for removing votes and discriminate ties
    }
}


$(async function () {


});
