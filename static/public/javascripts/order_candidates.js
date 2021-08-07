'use strict';

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

        if (!('perfect_tie' in choice)) {
            choice.perfect_tie = false;
        }

        for (const vote of Object.values(votes).sort((a, b) => a.order - b.order)) {

            // for (const vote of Object.keys(votes).reverse()) {

            if (for_ties) {
                cpt += vote.count_for_ties;
            }
            else {
                cpt += vote.count;
                // adding new count field to be used later for removing votes and discriminate ties
                vote.count_for_ties = vote.count;
            }

            if (cpt >= majority & !majority_found) {

                if (for_ties) {
                    choice["majority_grade_for_ties"] = vote.value;
                    choice["majority_grade_for_ties_order"] = vote.order;
                }
                else {
                    choice["majority_grade"] = vote.value;
                    choice["majority_grade_order"] = vote.order;
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
        return choices[0].name;
    }
    else {

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


        // case where all the votes of perfect ties were removed
        if (VOTERS_COUNT == 0) {
            if (for_ties) {
                for (const tie of ties) {

                    tie.perfect_tie = true;
                    tie.majority_grade_for_ties = null;

                }
            }
            return choices[0].name;
        }


        var majority = get_majority(VOTERS_COUNT);

        // recursive call, that will continue until there are different majority grades between ties

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


// Possible outcomes for a poll are : 
// 1 winner (with or without ties)
// Winners (perfect equality between some candidates)
// No winner (Perfect equality between all candidates, no votes on poll)
function detect_outcome(choices, ranking) {

    // 0 votes

    if (get_voters_count(choices) == 0) {
        return "No winner : there is no vote on this poll";
    }

    // all candidates are perfect ties

    var perfect_tie = true;
    for (var choice of choices) {
        perfect_tie = perfect_tie && choice.perfect_tie;
    }
    if (perfect_tie)
        return "No winner : all candidates are perfectly equal";

    // Several winners that are perfectly equal

    const perfect_ties = choices.filter(function (el) {
        return el.perfect_tie == true;
    })

    const winner_infos = choices.filter(function (el) {
        return el.name == ranking[0];
    })

    if (perfect_ties.length >= 2) {
        if (perfect_ties[0].majority_grade == winner_infos[0].majority_grade && winner_infos[0].majority_grade_for_ties == null) {
            let names = perfect_ties.map(a => a.name);
            return "The winners are " + names.join(' and ') + ". There is perfect equality between them.";
        }
    }

    // One winner that was separated from some other candidate(s)

    const winner_ties = choices.filter(function (el) {
        return el.majority_grade == winner_infos[0].majority_grade && el.name != ranking[0];
    })

    if (winner_ties.length >= 1) {
        const winner_ties_names = winner_ties.map(a => a.name);
        return "The winner is " + ranking[0] + ". It was separated from " + winner_ties_names.join(' and ') + " that had the same majority grade.";
    }

    // One winner that did not have to be separated

    return "The winner is " + ranking[0] + ". All majority grades were different so no candidates had to be separated by removing votes."

}



$(async function () {


});
