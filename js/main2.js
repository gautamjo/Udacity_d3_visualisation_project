// setting up canvas size
var margin = { top: 20, right: 20, bottom: 30, left: 40 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// setting up x scale
var x = d3.scaleBand()
    .range([0, width]);

// setting up y scale
var y = d3.scaleLinear()
    .range([height, 0]);

// setting up tooltip functionality provided by d3-tip.js
var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
        return "Count: <span style='color:#40e0d0'>" + d.Count + "</span>";
    })

// setting up svg area 
var svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// initiating tootltip
svg.call(tip);

// reading csv data
d3.csv("data/cancelled_by_month.csv", function(error, data) {
    if (error) throw error;
    // sorting by descending order
    data.sort(function(a, b) { return parseInt(b.Count) - parseInt(a.Count); });

    // setting up x domain
    x.domain(data.map(function(d) { return d.Month; }))
        .paddingInner(0.2)
        .paddingOuter(0.5);
    // setting up y domain
    y.domain([0, d3.max(data, function(d) { return parseInt(d.Count); })]);

    // setting up x axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // setting up y axis
    svg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .text("Cancellations");

    // setting up SVG rect and adding data and mouse interations
    svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.Month); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(parseInt(d.Count)); })
        .attr("height", function(d) { return height - y(parseInt(d.Count)); })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);
});