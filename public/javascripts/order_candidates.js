'use strict';

// const { checkout } = require("superagent");


function checkout_voters_count(choices) {
    var VOTERS_COUNT_OLD = 0;
    var VOTERS_COUNT;

    for (const choice of choices) {

        VOTERS_COUNT = 0;

        for (const vote of Object.keys(choice.votes)) {
            VOTERS_COUNT += choice.votes[vote].count;
        }

        if (choice.name != choices[0].name && VOTERS_COUNT_OLD != VOTERS_COUNT)
            throw "the number of votes by candidate is not the same";

        VOTERS_COUNT_OLD = VOTERS_COUNT;

    }
}

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
    // var majority;
    // if (VOTERS_COUNT % 2 == 0) {
    //     majority = VOTERS_COUNT / 2
    // }
    // else {
    //     majority = (VOTERS_COUNT + 1) / 2
    // }
    // return (majority);


    var majority;
    if (VOTERS_COUNT % 2 == 0) {
        majority = (VOTERS_COUNT - 1) / 2
    }
    else {
        majority = VOTERS_COUNT / 2
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

function compare_for_ties(a, b) {
    if (a.majority_grade_for_ties_order < b.majority_grade_for_ties_order) {
        return 1;
    }
    if (a.majority_grade_for_ties_order > b.majority_grade_for_ties_order) {
        return -1;
    }
    return 0;
}

function get_majority_grades(choices, majority, for_ties) {

    for_ties = for_ties || false;


    // funtion that adds to choices the majority grade of each candidate, and its order
    for (const choice of choices) {

        var votes = choice.votes;
        var cpt = 0;
        var majority_found = false;

        for (const vote of Object.keys(votes).reverse()) {

            if (for_ties) {
                console.log("passing in for ties for candidate " + choice.name)
                cpt += votes[vote].count_for_ties;

            }
            else {
                cpt += votes[vote].count;
                // adding new count field to be used later for removing votes and discriminate ties
                votes[vote].count_for_ties = votes[vote].count;
                // console.log("adding " + votes[vote].count + " votes on grade " + votes[vote].value + " and candidate " + choice.name);
            }


            if (cpt >= majority & !majority_found) {

                if (for_ties) {
                    choice["majority_grade_for_ties"] = votes[vote].value;
                    choice["majority_grade_for_ties_order"] = votes[vote].order;
                    console.log("In ties : majority grade is " + votes[vote].value + " for candidate " + choice.name);
                }
                else {
                    choice["majority_grade"] = votes[vote].value;
                    choice["majority_grade_order"] = votes[vote].order;
                    console.log("majority grade is " + votes[vote].value + " for candidate " + choice.name);
                }
                majority_found = true;

            }
        }
    }
    //reordering choices according to their majority grades

    if (for_ties)
        choices.sort(compare_for_ties);
    else
        choices.sort(compare);
}

function return_winner(choices, majority, for_ties) {

    for_ties = for_ties || false;


    get_majority_grades(choices, majority, for_ties);


    var winning_grade;
    var ties;

    if (for_ties) {
        winning_grade = choices[0].majority_grade_for_ties;
        ties = choices.filter(function (el) {
            return el.majority_grade_for_ties == winning_grade;
        }
        )
    }
    else {
        winning_grade = choices[0].majority_grade;
        ties = choices.filter(function (el) {
            return el.majority_grade == winning_grade;
        }
        )
    }

    if (ties.length == 1) {
        // console.log("No ties, the winner is : " + choices[0].name);
        return choices[0].name;
    }
    else {
        // console.log("There are " + ties.length + " ties");

        // removes one vote for each winning grade in the tied candidates

        for (const choice of ties) {

            var votes = choice.votes;

            for (const vote of Object.keys(votes)) {

                if (votes[vote].value == winning_grade) {
                    votes[vote].count_for_ties -= 1;
                }
            }
        }

        var VOTERS_COUNT = get_voters_count(ties, true);

        if (VOTERS_COUNT == 0)
            return choices[0].name;

        var majority = get_majority(VOTERS_COUNT);

        // recursive call, that will continue until there are different majority grades between ties

        // console.log("Removed counts once to handle ties")

        return return_winner(ties, majority, true);

    }
}

function order_candidates_(choices, majority) {

    if (choices.length == 1)
        return [choices[0].name];

    const VOTERS_COUNT = get_voters_count(choices);

    if (VOTERS_COUNT == 0)
        return [choices[0].name];



    let winner = return_winner(choices, majority);
    let the_rest = choices.filter(function (el) {
        return el.name != winner;
    })

    // console.log("Winner is now " + winner);

    return [winner].concat(order_candidates_(the_rest));

}


function order_candidates(choices) {

    checkout_voters_count(choices);

    const VOTERS_COUNT = get_voters_count(choices);
    const majority = get_majority(VOTERS_COUNT);

    return order_candidates_(choices, majority);

}



function mapOrder(array, order, key) {

    array.sort(function (a, b) {
        var A = a[key], B = b[key];

        if (order.indexOf(A) > order.indexOf(B)) {
            return 1;
        } else {
            return -1;
        }

    });

    return array;
};



$(async function () {


});
