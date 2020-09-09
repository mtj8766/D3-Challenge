// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("assets/data/data.csv").then(function(riskData, err) {
    if (err) throw err;

    riskData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.obesity = +data.obesity;
    });

    var xLinearScale = d3.scaleLinear()
        .domain([8, d3.max(riskData, d => d.poverty)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([20, d3.max(riskData, d => d.obesity)])
        .range([height, 0]);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);


    var circlesGroup = chartGroup.selectAll("circle")
        .data(riskData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.obesity))
        .attr("r", "13")
        .attr("fill", "teal")
        .attr("opacity", ".5")
      
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([60, -40])
        .html(function(d) {
            return (`<b>${d.state}<br>Poverty: ${d.poverty}%<br>Obesity ${d.obesity}%</b>`);
      });

  
    chartGroup.call(toolTip);


    circlesGroup.on("click", function(data) {
        toolTip.show(data, this);
    })
      
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
      });

    chartGroup.append("text")
        .style("font-size", "11px")
        .style("fill", "white")
        .style("font-weight", "bold")
        .attr("text-anchor", "middle")
        .selectAll("tspan")
        .data(riskData)
        .enter()
        .append("tspan")
            .attr("x", function(data) {
                return xLinearScale(data.poverty);
            })
            .attr("y", function(data) {
                return yLinearScale(data.obesity - .15);
            })
            .text(function(data) {
                return data.abbr
            });

    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Obese (%)");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("In Poverty (%)");
  }).catch(function(error) {
    console.log(error);
  });