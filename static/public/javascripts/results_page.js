'use strict';

import {
    get_voters_count,
    order_candidates,
    mapOrder,
    detect_outcome
} from './order_candidates.js';

import draw_global_results from './draw_global_results.js';

import { draw_candidate_results, update_candidate_results }
from './draw_candidate_results.js';

export default function(localeMsgs, localeGrades) {

    let choices = [];

    for (const c of parsedPoll.choices) {

        let choice = {

            'name': c.name,
            'votes': {}
        }

        for (const v of c.votes) {

            const grade_id = v.grade.id;

            choice.votes[grade_id] = {

                "value": v.grade.value,
                "order": v.grade.order,
                "count": v.count,

            }
        }

        choices.push(choice);
    }


    const VOTERS_COUNT = get_voters_count(choices);

    // ranking candidates according to the votes

    const ranking = order_candidates(choices);

    mapOrder(choices, ranking, 'name');

    const outcome = detect_outcome(choices, ranking, localeMsgs);

    let width = $(window).width();

    if (width < 1500) {
        Chart.defaults.font.size = 12;
        Chart.defaults.plugins.title.font.size = 15;
    } else {
        Chart.defaults.font.size = 20;
        Chart.defaults.plugins.title.font.size = 28;
    }

    draw_global_results(choices, localeMsgs, localeGrades);

    $('#title').text(parsedPoll.title);
    $('#results_alert_text').text(outcome);


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

    $('#formRadiosCandidate_selection').change(function(e) {
        update_candidate_results(choices, $(e.target).val(), localeMsgs, localeGrades);
    })

    // graph with a focus on the chosen candidate

    draw_candidate_results(choices, $("input:radio[name='radio_btn_candidate_selection']:checked").val(), localeMsgs, localeGrades);


};