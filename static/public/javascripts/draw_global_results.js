'use strict';

import { get_voters_count, get_majority } from "./order_candidates.js";
import colorPalettes from './colorPalettes.js';
import {
    LocaleMessages
} from '/javascripts/LocaleMessages.js';
import { stringSplitter } from '/javascripts/utils.js';


const localeMsgs = await LocaleMessages.new(
    'client-pollResults');
const localeGrades = await LocaleMessages.new(
    'db-grades');

/**
 * Custom positioner
 * @function Tooltip.positioners.myCustomPositioner
 * @param elements {Chart.Element[]} the tooltip elements
 * @param eventPosition {Point} the position of the event in canvas coordinates
 * @returns {Point} the tooltip position
 */
const tooltipPlugin = Chart.registry.getPlugin('tooltip');
tooltipPlugin.positioners.myCustomPositioner = function(elements, eventPosition) {
    /** @type {Tooltip} */
    return eventPosition;
};

function draw_global_results(choices) {

    const VOTERS_COUNT = get_voters_count(choices);
    const majority_plot = get_majority(VOTERS_COUNT);

    // Names of choices, eg candidates, in the poll
    const labels = [];
    for (const choice of choices) {
        labels.push(stringSplitter(choice.name, 23));
    }

    // Getting possible values
    const values = [];
    var choice = choices[0];
    var votes = choice.votes;
    for (const vote of Object.values(votes).sort((a, b) => b.order - a.order)) {
        values.push(vote.value);
    }


    var palette = colorPalettes.SELECTED_PALETTE;

    // Getting the appropriate color palette
    if (values.length <= 3) {
        palette = COLORS_3;
    }
    if (values.length <= 5 & values.length > 3) {
        palette = COLORS_5;
    }


    // Creating the data structure as needed by Chartjs to be plotted
    var dataset = [];
    var cpt = 0;

    for (const vote of Object.values(votes).sort((a, b) => a.order - b.order)) {
        const entry = {
            "label": localeGrades.get(vote.value),
            "data": [vote.count],
            "backgroundColor": colorPalettes.color(cpt, palette),
        };
        dataset.push(entry);
        cpt += 1;
    }

    for (choice of choices.slice(-choices.length + 1)) {
        var votes = choice.votes;
        var cpt = 0;
        for (const vote of Object.values(votes).sort((a, b) => a.order - b.order)) {
            dataset[cpt].data.push(vote.count);
            cpt += 1;
        }
    }

    // data to be plotted
    const data = {
        labels: labels,
        datasets: dataset
    };

    const localeGlobalResults = localeMsgs.get('globalResults');

    // Configurating the plot
    const config = {
        type: 'bar',
        data: data,
        options: {
            plugins: {
                title: {
                    display: true,
                    text: localeGlobalResults.get("voteNumber", { nvotes: VOTERS_COUNT })
                },
                autocolors: false,
                annotation: {
                    annotations: [{
                        type: 'line',
                        xScaleID: 'x',
                        yMin: majority_plot,
                        yMax: majority_plot,
                        xMin: labels[0],
                        xMax: labels[labels.length - 1],
                        borderColor: 'hsl(0, 0%, 100%)',
                        borderWidth: 4,
                        label: {
                            enabled: true,
                            content: localeGlobalResults.get('majorityGrade')
                        }
                    }],
                    drawTime: 'afterDatasetsDraw'
                },
                tooltip: {
                    reverse: true,
                    position: 'myCustomPositioner'
                },
                legend: {
                    reverse: true,
                    onClick: null
                }
            },
            layout: {
                padding: {
                    bottom: 0
                }
            },
            interaction: true,
            aspectRatio: 16 / 9,
            responsive: true,
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true,
                    min: 0,
                    max: VOTERS_COUNT
                }
            }
        }
    };

    // drawing the plot, finally
    var myChart = new Chart(
        document.getElementById('results_plot'),
        config
    );
}

export default draw_global_results;