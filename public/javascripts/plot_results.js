'use strict';

$(async function () {

    console.log(parsedPoll);


    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 30, bottom: 20, left: 50 },
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#results_plot")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // set the ranges
    var x = d3.scaleBand()
        .range([0, width])
        .padding(0.1);
    var y = d3.scaleLinear()
        .range([height, 0]);

    // var results = []

    // for (var choice of choices) {
    //     for (var vote of Object.keys(choice["votes"])) {
    //         const entry = { "choice": choice.name, "value": choice["votes"][vote].value, "count": choice["votes"][vote].count };
    //         results.push(entry);
    //     }
    // }
    // console.log(results);



    d3.json(parsedPoll, function (error, data) {

        data.forEach(function (d) {
            d.choice = d.choice;
            d.count = d.count;
            d.value = d.value;
        });

    });

});


