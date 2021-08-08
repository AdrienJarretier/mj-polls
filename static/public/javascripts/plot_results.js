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

    var choices = parsedPoll["choices"];


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


    /**
     * Custom positioner
     * @function Tooltip.positioners.myCustomPositioner
     * @param elements {Chart.Element[]} the tooltip elements
     * @param eventPosition {Point} the position of the event in canvas coordinates
     * @returns {Point} the tooltip position
     */
    const tooltipPlugin = Chart.registry.getPlugin('tooltip');
    tooltipPlugin.positioners.myCustomPositioner = function (elements, eventPosition) {
        /** @type {Tooltip} */
        return eventPosition;
    };


    // hauteur du graphe
    // voir si l'alerte est pertinente

    // Configurating the plot
    const config = {
        type: 'bar',
        data: data,
        options: {

            // onClick: (e) => {
            //     const canvasPosition = Chart.helpers.getRelativePosition(e, myChart);

            //     // Substitute the appropriate scale IDs
            //     const dataX = myChart.scales.x.getValueForPixel(canvasPosition.x);
            //     const dataY = myChart.scales.y.getValueForPixel(canvasPosition.y);

            //     // $('#modal-title').text(dataX);
            //     // $('#myModal').modal('show');

            //     // console.log(choices[dataX].name);
            // },

            plugins: {

                title: {
                    display: true,
                    text: 'Graphical results for poll : ' + parsedPoll.title,
                    font: {
                        size: 30
                    }
                },
                subtitle: {
                    display: true,
                    text: 'Number of voters : ' + VOTERS_COUNT,
                    font: {
                        size: 25
                    }
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
                    reverse: true,
                    position: 'myCustomPositioner'
                },
                legend: {
                    reverse: true,
                    onClick: null,
                    labels: {
                        font: {
                            size: 22
                        }
                    }
                }
            },
            layout: {
                padding: {
                    bottom: 0
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
    $('#results_alert_text').text("    " + outcome);


    // drawing the plot, finally
    var myChart = new Chart(
        document.getElementById('results_plot'),
        config
    );
});


