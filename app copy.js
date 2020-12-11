// @TODO: YOUR CODE HERE!
// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 500;

// Define the chart's margins as an object
var margin = {
  top: 60,
  right: 60,
  bottom: 80,
  left: 80
};

// Define dimensions of the chart area
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Select and append SVG area to it, and set its dimensions
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append a group area, then set its margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis ="obese";

// Retrieve data from the CSV file and execute everything below
d3.csv("data.csv").then(function(newsData) {
    // if (err) throw err;


 // function used for updating x-scale var upon click on axis label
 function xScale(newsData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([xMin,xMax])
      .range([0, chartWidth]);
  
    return xLinearScale;
  }
// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }
  
  // function used for updating y-scale var upon click on axis label
 function yScale(newsData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
      .domain([xMin,xMax])
      .range([chartHeight, 0]);
  
    return yLinearScale;
  }
// function used for updating yAxis var upon click on axis label
function renderAxes(newYScale, yAxis) {
    var bottomAxis = d3.axisBottom(newYScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return yAxis;
  }
  // function used for updating circles group with a transition to
  // new circles
  function renderXCircles(circlesGroup, newXScale, chosenXAxis) {
  
    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));
  
    return circlesGroup;
  }
// new circles Y
function renderYCircles(circlesGroup, newYScale, chosenYAxis) {
  
    circlesGroup.transition()
      .duration(1000)
      .attr("cy", d => newYScale(d[chosenYAxis]));
  
    return circlesGroup;
  }

// parse data

newsData.forEach(function(data) {
    data.obesity = +data.obesity;
    data.poverty = +data.poverty;
    data.smokes = +data.smokes;
    data.heathcare = +data.healthcare;
    data.age = +data.age;
    data.income = +data.income;
    
  });

  console.log(newsData)
  // minMax(newsData)


  // xLinearScale function above csv import
  var xLinearScale = xScale(newsData, chosenXAxis);
  var yLinearScale = yScale(newsData, chosenYAxis);

  // Create y scale function
//   var yLinearScale = d3.scaleLinear()
//     .domain([yMin, yMax])
//     .range([chartHeight, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
    .call(leftAxis);
//   chartGroup.append("g")
//     .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(newsData)
    .enter()

    circlesGroup
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 10)
    .attr("fill", "darkcyan")
    .attr("opacity", ".5");

    circlesGroup
    .append("text")
    .text(function(data){
      return data.abbr
    })
    .attr("dx",d => xLinearScale(d[chosenXAxis])-6)
    .attr("dy", d => yLinearScale (d[chosenYAxis] )+10/2.5)
    .attr("font-size", 10)

var circlesGroupXY = circlesGroup.append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 10)


// Create group for 3 x-axis labels

var labelsGroup = chartGroup.append("g")
.attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 10})`);

var povertyLabel = labelsGroup.append("text")
.attr("x", 0)
.attr("y", 20)
.attr("value", "poverty") // value to grab for event listener
.classed("active", true)
.text("Poverty");

var ageLabel = labelsGroup.append("text")
.attr("x", 0)
.attr("y", 40)
.attr("value", "age") // value to grab for event listener
.classed("inactive", true)
.text(" Age (Median)");

var incomeLabel = labelsGroup.append("text")
.attr("x", 0)
.attr("y", 60)
.attr("value", "income") // value to grab for event listener
.classed("inactive", true)
.text("Household Income (Median");


// append y axis
var labelsYGroup =chartGroup.append("g");

var obeseLabel = labelsYGroup.append("text")
.attr("transform", "rotate(-90)")
.attr("x", 0 - (chartHeight / 2))
.attr("y", 0 - margin.left)
.attr("value", "obesity") // value to grab for event listener
.classed("active", true)
.text("Obesity");

var smokesLabel = labelsYGroup.append("text")
.attr("transform", "rotate(-90)")
.attr("x", 0 - (chartHeight / 2))
.attr("y", -10 - margin.left)
.attr("value", "smokes") // value to grab for event listener
.classed("inactive", true)
.text("Smokes");

var healthcareLabel = labelsYGroup.append("text")
.attr("transform", "rotate(-90)")
.attr("x", 0 - (chartHeight / 2))
.attr("y", -20 - margin.left)
.attr("value", "healthcare") // value to grab for event listener
.classed("inactive", true)
.text("Healthcare");



// function used for updating circles group with new tooltip
 function updateToolTip(chosenXAxis, circlesGroup, chosenYAxis) {

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.rockband}<br>${label} ${d[chosenXAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}


  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, circlesGroup, chosenYAxis);

  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(newsData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup, chosenYAxis);

        // changes classes to change bold text
        if (chosenXAxis === "age") {
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true)
        }
        else if (chosenYAxis === "income"){
        povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", true)
            .classed("inactive", false)
        }
        else {
          povertyLabel
              .classed("active", true)
              .classed("inactive", false);
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
            incomeLabel
              .classed("active", false)
              .classed("inactive", true)
          }
      }
    });


// y axis labels event listener
labelsYGroup.selectAll("text")
.on("click", function() {
  // get value of selection
  var value = d3.select(this).attr("value");
  if (value !== chosenYAxis) {

    // replaces chosenYAxis with value
    chosenYAxis = value;

    // functions here found above csv import
    // updates y scale for new data
    yLinearScale = yScale(newsData, chosenYAxis);

    // updates x axis with transition
    yAxis = renderYAxes(yLinearScale, yAxis);

    // updates circles with new y values
    circlesGroup = renderCircles(circlesGroup, yLinearScale, chosenYAxis);

    // updates tooltips with new info
    circlesGroup = updateToolTip(chosenXAxis, circlesGroup, chosenYAxis);

    // changes classes to change bold text
    if (chosenXAxis === "smokes") {
      healthcareLabel
        .classed("active", false)
        .classed("inactive", true);
      smokesLabel
        .classed("active", true)
        .classed("inactive", false);
      obeseLabel
        .classed("active", false)
        .classed("inactive", true);
    }
    else if (chosenYAxis === "income"){
      healthcareLabel
      .classed("active", false)
      .classed("inactive", true);
      smokesLabel
      .classed("active", false)
      .classed("inactive", true);
      obeseLabel
      .classed("active", true)
      .classed("inactive", false);
    }
    else {
      healthcareLabel
        .classed("active", true)
        .classed("inactive", false);
      smokesLabel
        .classed("active", false)
        .classed("inactive", true);
      obeseLabel
        .classed("active", false)
        .classed("inactive", true);
      }
  }
});

}).catch(function(error) {
  console.log(error);
});


