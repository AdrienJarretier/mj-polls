'use strict';

// Palettes definition
const COLORS_7 = [
    "#df8568", "#feb39a", "#f6d3a2", "#f8e6b5", "#c1dbb3", "#7ebc89", "#54a062"
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

    const choices = parsedPoll["choices"];

    var VOTERS_COUNT = 0;

    // Number of choices, eg candidates, in the poll
    const DATA_COUNT = choices.length;

    // Names of choices, eg candidates, in the poll
    const labels = [];
    for (const choice of choices) {
        labels.push(choice.name);
    }

    // Getting possible values
    const values = [];
    var choice = choices[0];
    var votes = choice.votes;
    for (const vote of Object.keys(votes)) {
        values.push(votes[vote].value);
    }


    var palette = COLORS_7;

    // Getting the appropriate color palette
    if (values.length <= 3) {
        palette = COLORS_3;
    }
    if (values.length <= 5 & values.length > 3) {
        palette = COLORS_5;
    }
    if (values.length <= 7 & values.length > 5) {
        palette = COLORS_7;
    }


    // Creating the data structure as needed by Chartjs to be plotted
    var dataset = [];
    var cpt = 0;

    for (const vote of Object.keys(votes).reverse()) {
        const entry = { "label": votes[vote].value, "data": [votes[vote].count], "backgroundColor": color(cpt, palette), };
        dataset.push(entry);
        cpt += 1;
        VOTERS_COUNT += votes[vote].count;
    }

    for (choice of choices.slice(-choices.length + 1)) {
        var votes = choice.votes;
        var cpt = 0;
        for (const vote of Object.keys(votes).reverse()) {
            dataset[cpt].data.push(votes[vote].count);
            cpt += 1;
        }
    }

    const data = {
        labels: labels,
        datasets: dataset
    };

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
                    text: 'Number of voters :' + VOTERS_COUNT
                },
                autocolors: false,
                annotation: {
                    annotations: [{
                        type: 'line',
                        xScaleID: 'x',
                        yMin: VOTERS_COUNT / 2,
                        yMax: VOTERS_COUNT / 2,
                        xMin: labels[0],
                        xMax: labels[labels.length - 1],
                        borderColor: 'rgb(240, 240, 240)',
                        borderWidth: 4,
                        label: {
                            enabled: true,
                            content: 'Median'
                        }
                    }],
                    drawTime: 'afterDraw'
                }
            },
            layout: {
                padding: {
                    bottom: 400
                }
            },
            responsive: true,
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true
                }
            }
        }
    };

    var myChart = new Chart(
        document.getElementById('results_plot'),
        config
    );

});


