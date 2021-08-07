'use strict';

// Palettes definition
// const COLORS_7 = [
//     "#df8568", "#F7A578", "#FBC789", "#FBD989", "#c1dbb3", "#7ebc89", "#54a062"
// ];

// new color palette
const COLORS_7 = [
    '#00935e', '#50b67f', '#9fd99f', '#effcc0', '#FBD989', '#e29e6d', '#c96251'
];


const COLORS_3 = [
    "#df8568", "#f8e6b5", "#54a062"
];

const COLORS_5 = [
    "#df8568", "#feb39a", "#f8e6b5", "#7ebc89", "#54a062"
];

function color(index, palette) {
    return palette[index % palette.length];
}


$(async function () {

    // var choices = parsedPoll["choices"];

    let choices = [{ "id": 8, "poll_id": 4, "name": "a", "votes": { "1": { "id": 1, "value": "Excellent", "order": 60, "count": 3 }, "2": { "id": 2, "value": "Very good", "order": 50, "count": 2 }, "3": { "id": 3, "value": "Good", "order": 40, "count": 3 }, "4": { "id": 4, "value": "Passable", "order": 30, "count": 0 }, "5": { "id": 5, "value": "Inadequate", "order": 20, "count": 3 }, "6": { "id": 6, "value": "Mediocre", "order": 10, "count": 2 }, "7": { "id": 7, "value": "Bad", "order": 0, "count": 0 } } }, { "id": 9, "poll_id": 4, "name": "b", "votes": { "1": { "id": 1, "value": "Excellent", "order": 60, "count": 0 }, "2": { "id": 2, "value": "Very good", "order": 50, "count": 1 }, "3": { "id": 3, "value": "Good", "order": 40, "count": 7 }, "4": { "id": 4, "value": "Passable", "order": 30, "count": 0 }, "5": { "id": 5, "value": "Inadequate", "order": 20, "count": 0 }, "6": { "id": 6, "value": "Mediocre", "order": 10, "count": 5 }, "7": { "id": 7, "value": "Bad", "order": 0, "count": 0 } } }, { "id": 10, "poll_id": 4, "name": "c", "votes": { "1": { "id": 1, "value": "Excellent", "order": 60, "count": 5 }, "2": { "id": 2, "value": "Very good", "order": 50, "count": 1 }, "3": { "id": 3, "value": "Good", "order": 40, "count": 0 }, "4": { "id": 4, "value": "Passable", "order": 30, "count": 1 }, "5": { "id": 5, "value": "Inadequate", "order": 20, "count": 0 }, "6": { "id": 6, "value": "Mediocre", "order": 10, "count": 1 }, "7": { "id": 7, "value": "Bad", "order": 0, "count": 5 } } }];


    const VOTERS_COUNT = get_voters_count(choices);
    const majority_plot = get_majority(VOTERS_COUNT);

    // ranking candidates according to the votes
    const ranking = order_candidates(choices);

    mapOrder(choices, ranking, 'name');

    const outcome = detect_outcome(choices, ranking);

    console.log(choices);
    console.log(get_majority(VOTERS_COUNT));

    // Names of choices, eg candidates, in the poll
    const labels = [];
    for (const choice of choices) {
        labels.push(choice.name);
    }

    // Getting possible values
    const values = [];
    var choice = choices[0];
    var votes = choice.votes;
    for (const vote of Object.values(votes).sort((a, b) => b.order - a.order)) {
        values.push(vote.value);
    }


    var palette = COLORS_7.reverse();

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
        const entry = { "label": vote.value, "data": [vote.count], "backgroundColor": color(cpt, palette), };
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

    Chart.defaults.font.size = 18;



    // Configurating the plot
    const config = {
        type: 'bar',
        data: data,
        options: {
            plugins: {

                title: {
                    display: true,
                    text: 'Vote results for poll : ' + parsedPoll.title
                },
                subtitle: {
                    display: true,
                    text: 'Number of voters : ' + VOTERS_COUNT
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
                        borderColor: 'rgb(240, 240, 240)',
                        borderWidth: 4,
                        label: {
                            enabled: true,
                            content: 'Majority grade'
                        }
                    }],
                    drawTime: 'afterDatasetsDraw'
                },
                tooltip: {
                    position: 'nearest'
                },
                legend: {
                    labels: {
                        font: {
                            size: 20
                        }
                    }
                }
            },
            layout: {
                padding: {
                    bottom: 200
                }
            },

            interaction: true,
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

    // $('#results_alert_header').text("Results for poll : " + parsedPoll.title);
    $('#results_alert_text').text(outcome);


    // drawing the plot, finally
    var myChart = new Chart(
        document.getElementById('results_plot'),
        config
    );
});


