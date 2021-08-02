'use strict';




// Palettes definition
const COLORS_7 = [
    "#df8568", "#F7A578", "#FBC789", "#FBD989", "#c1dbb3", "#7ebc89", "#54a062"
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
    const majority = get_majority(VOTERS_COUNT);
    const majority_plot = get_majority_line_for_plot(VOTERS_COUNT);

    // funtion that addes to choices the majority grade of each candidate, and its order

    // get winner

    // console.log(return_winner(choices, majority, false));

    const ranking = order_candidates(choices, majority);

    console.log(choices);


    // const ordered_choices = mapOrder(choices, ranking, 'name');

    // console.log(ordered_choices);




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


    // Creating the data structure as needed by Chartjs to be plotted
    var dataset = [];
    var cpt = 0;

    for (const vote of Object.keys(votes).reverse()) {
        const entry = { "label": votes[vote].value, "data": [votes[vote].count], "backgroundColor": color(cpt, palette), };
        dataset.push(entry);
        cpt += 1;
    }

    for (choice of choices.slice(-choices.length + 1)) {
        var votes = choice.votes;
        var cpt = 0;
        for (const vote of Object.keys(votes).reverse()) {
            dataset[cpt].data.push(votes[vote].count);
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
                        // This more specific font property overrides the global property
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

    // drawing the plot, finally
    var myChart = new Chart(
        document.getElementById('results_plot'),
        config
    );
});


