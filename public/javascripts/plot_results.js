'use strict';

const COLORS = [
    '#4dc9f6',
    '#f67019',
    '#f53794',
    '#537bc4',
    '#acc236',
    '#166a8f',
    '#00a950',
    '#58595b',
    '#8549ba'
];

function color(index) {
    return COLORS[index % COLORS.length];
}

const CHART_COLORS = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
};

const NAMED_COLORS = [
    CHART_COLORS.red,
    CHART_COLORS.orange,
    CHART_COLORS.yellow,
    CHART_COLORS.green,
    CHART_COLORS.blue,
    CHART_COLORS.purple,
    CHART_COLORS.grey,
];

function namedColor(index) {
    return NAMED_COLORS[index % NAMED_COLORS.length];
}



$(async function () {

    const choices = parsedPoll["choices"];

    // Number of choices, eg candidates, in the poll
    const DATA_COUNT = choices.length;

    // Names of choices, eg candidates, in the poll
    const labels = [];
    for (const choice of choices) {
        labels.push(choice.name);
    }

    // Filling the data to be plotted as well
    var dataset = [];
    var choice = choices[0];
    var votes = choice.votes;
    var cpt = 0;
    for (const vote of Object.keys(votes)) {
        const entry = { "label": votes[vote].value, "data": [votes[vote].count], "backgroundColor": color(cpt), };
        dataset.push(entry);
        cpt += 1;
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
    console.log(parsedPoll.voters_count / 2)

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
                    text: 'Number of voters :' + parsedPoll.voters_count
                },
                autocolors: false,
                annotation: {
                    annotations: [{
                        type: 'line',
                        xScaleID: 'x',
                        yMin: parsedPoll.voters_count / 2,
                        yMax: parsedPoll.voters_count / 2,
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


