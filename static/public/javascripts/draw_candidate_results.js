var myChart;

function draw_candidate_results(choices, candidate) {

    const VOTERS_COUNT = get_voters_count(choices);
    const majority_plot = get_majority(VOTERS_COUNT);

    // Name of the choice of interest
    const labels = [candidate];

    // Getting possible values

    const choice = choices.filter(function (el) {
        return el.name == candidate;
    })

    const values = [];
    var votes = choice[0].votes;

    for (const vote of Object.values(votes).sort((a, b) => b.order - a.order)) {
        values.push(vote.value);
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
    var yMin = 0;

    for (const vote of Object.values(votes).sort((a, b) => a.order - b.order)) {
        const entry = { "label": vote.value, "data": [vote.count], "backgroundColor": color(cpt, palette), };
        dataset.push(entry);
        cpt += 1;
        if (choice[0].majority_grade_order > vote.order)
            yMin += vote.count;


    }
    const yMax = VOTERS_COUNT;


    const percentage_above = Math.round((VOTERS_COUNT - yMin) / VOTERS_COUNT * 100, 2);

    // data to be plotted
    const data = {
        labels: labels,
        datasets: dataset
    };

    // Configurating the plot
    const config = {
        type: 'bar',
        data: data,
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'The majority grade of ' + candidate + ' is ' + choice[0].majority_grade,
                    font: {
                        size: 35
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
                        xMax: labels[0],
                        borderColor: 'rgb(240, 240, 240)',
                        borderWidth: 4,
                        label: {
                            enabled: true,
                            content: percentage_above + ' % of voters gave ' + candidate + ' the grade ' + choice[0].majority_grade + ' or above.'
                        }
                    },
                    {
                        type: 'box',
                        yMin: yMin,
                        yMax: yMax,
                        backgroundColor: 'rgba(255, 255, 255, 0.25)',
                        borderColor: 'rgba(255, 255, 255, 1)'
                    }
                    ],
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


    // drawing the plot, finally
    myChart = new Chart(
        document.getElementById('results_per_candidate'),
        config
    );
}



function update_candidate_results(choices, candidate) {

    const VOTERS_COUNT = get_voters_count(choices);
    const majority_plot = get_majority(VOTERS_COUNT);

    // Name of the choice of interest
    const labels = [candidate];

    // Getting possible values

    const choice = choices.filter(function (el) {
        return el.name == candidate;
    })

    const values = [];
    var votes = choice[0].votes;

    for (const vote of Object.values(votes).sort((a, b) => b.order - a.order)) {
        values.push(vote.value);
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
    var yMin = 0;

    for (const vote of Object.values(votes).sort((a, b) => a.order - b.order)) {
        const entry = { "label": vote.value, "data": [vote.count], "backgroundColor": color(cpt, palette), };
        dataset.push(entry);
        cpt += 1;
        if (choice[0].majority_grade_order > vote.order)
            yMin += vote.count;
    }
    const yMax = VOTERS_COUNT;

    const percentage_above = Math.round((VOTERS_COUNT - yMin) / VOTERS_COUNT * 100, 2);

    myChart.data.labels = labels;
    myChart.data.datasets = dataset;
    myChart.options.plugins.title = {
        display: true,
        text: 'The majority grade of ' + candidate + ' is ' + choice[0].majority_grade,
        font: {
            size: 35
        }
    };

    myChart.options.plugins.annotation.annotations = [{
        type: 'line',
        xScaleID: 'x',
        yMin: majority_plot,
        yMax: majority_plot,
        xMin: labels[0],
        xMax: labels[0],
        borderColor: 'rgb(240, 240, 240)',
        borderWidth: 4,
        label: {
            enabled: true,
            content: percentage_above + ' % of voters gave ' + candidate + ' the grade ' + choice[0].majority_grade + ' or above.'
        }
    },
    {
        type: 'box',
        yMin: yMin,
        yMax: yMax,
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        borderColor: 'rgba(255, 255, 255, 1)'
    }];

    myChart.update();
}