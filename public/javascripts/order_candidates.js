'use strict';

function get_voters_count(choices, for_ties) {

    for_ties = for_ties || false;

    var choice = choices[0];
    var votes = choice.votes;
    var VOTERS_COUNT = 0;

    for (const vote of Object.keys(votes)) {

        if (for_ties) {
            VOTERS_COUNT += votes[vote].count_for_ties;
        }
        else {
            VOTERS_COUNT += votes[vote].count;
        }
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
        var majority_found = false;

        for (const vote of Object.keys(votes).reverse()) {

            if (for_ties) {
                cpt += votes[vote].count_for_ties;

            }
            else {
                cpt += votes[vote].count;
                // adding new count field to be used later for removing votes and discriminate ties
                votes[vote].count_for_ties = votes[vote].count;
            }


            if (cpt >= majority & !majority_found) {

                choice["majority_grade"] = votes[vote].value;
                choice["majority_grade_order"] = votes[vote].order;
                majority_found = true;

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

        for (const choice of ties) {

            var votes = choice.votes;

            for (const vote of Object.keys(votes)) {

                if (votes[vote].value == winning_grade) {
                    // console.log("Count for ties of " + choice.name + " was " + votes[vote].count_for_ties)
                    votes[vote].count_for_ties -= 1;
                    // console.log("Count for ties of " + choice.name + " is now " + votes[vote].count_for_ties)
                }

            }
        }

        var VOTERS_COUNT = get_voters_count(ties, true);
        var majority = get_majority(VOTERS_COUNT);

        // console.log("Voters count for ties :" + VOTERS_COUNT);
        // console.log("Majority for ties :" + majority);

        // see if there are still ties

        get_majority_grades(ties, majority, true);

        // recursive call, that will continue until there are different majority grade between ties

        console.log("Removed counts to handle ties")

        handle_ties(ties);

    }
}


$(async function () {


});
