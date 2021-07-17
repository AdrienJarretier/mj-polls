'use strict';

// Palettes definition
const COLORS_7 = [
    "#95F9C3",
    "#7ED9B4",
    "#67B9A4",
    "#509995",
    "#397885",
    "#225876",
    "#0B3866"
];


const COLORS_3 = [
    "#95F9C3",
    "#509995",
    "#0B3866"
];


const COLORS_5 = [
    "#95F9C3",
    "#73C9AC",
    "#509995",
    "#2E687D",
    "#0B3866"
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

    console.log(palette);

    // Creating the data structure as needed by Chartjs to be plotted
    var dataset = [];
    var cpt = 0;

    for (const vote of Object.keys(votes)) {
        const entry = { "label": votes[vote].value, "data": [votes[vote].count], "backgroundColor": color(cpt, palette), };
        dataset.push(entry);
        cpt += 1;
        VOTERS_COUNT += votes[vote].count;
        values.push(votes[vote].value);
    }



    for (choice of choices.slice(-choices.length + 1)) {

        var votes = choice.votes;
        var cpt = 0;
        for (const vote of Object.keys(votes)) {
            dataset[cpt].data.push(votes[vote].count);
            cpt += 1;
        }

    }

    console.log(dataset);

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


