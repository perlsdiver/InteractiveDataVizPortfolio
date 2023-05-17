// updates from original
// added tooltip


/* CONSTANTS AND GLOBALS */
 const width = window.innerWidth * 0.7,
 height = window.innerHeight * 0.7,
 margin = { top: 20, bottom: 80, left: 120, right: 60 }

 const state = {
  sortBy: "Year", // Possible values: "Year", "Estimate"
};


/* LOAD DATA */
d3.csv("../../data/us_homeless_estimate.csv", d3.autoType).then((data) => {
  console.log(data);

 // x scale - linear, year
 const xScale = d3
 .scaleLinear()
 .domain([2006, 2023])
 .range([margin.left, width - margin.right]);

// y scale - linear, count
const yScale = d3
 .scaleLinear()
 .domain([500000, d3.max(data, (d) => +d.Estimate)])
 .range([height - margin.bottom, margin.top]);

 // svg
 const svg = d3
 .select("#container")
 .append("svg")
 .attr("width", width)
 .attr("height", height);

// x axis scales and labels
const xAxis = d3.axisBottom(xScale)
 .tickValues(d3.range(2007, 2023, 1))
 .tickFormat(d3.format("d"));

svg
 .append("g")
 .attr("transform", `translate(0,${height - margin.bottom})`)
 .call(xAxis);

svg
.append("text")
.attr("x", width/2)
.attr("y", height - margin.bottom/3)
.attr("text-anchor", "middle")
.attr("font-weight", "bold")
.text("Year");

svg.selectAll(".tick text")
.attr("transform", "rotate(-90)")
.attr("text-anchor", "end")
.attr("dx", "-0.8em")
.attr("dy", "0.15em");

// y axis scales and labels
const yAxis = d3.axisLeft(yScale).ticks(5, "s");
const yAxisGroup = svg
 .append("g")
 .attr("transform", `translate(${margin.left},0)`)
 .call(yAxis);

svg
 .append("text")
 .attr("x", -height / 2)
 .attr("y", margin.left / 2)
 .attr("text-anchor", "middle")
 .attr("transform", "rotate(-90)")
 .attr("dy", "1em")
 .text("Estimated Homeless Population (in the US)");


 // line
 const sizeScale = d3
 .scaleSqrt()
 .domain([525000, d3.max(data, (d) => +d.Estimate)+100000])
 .range([2, 25]);


  // LINE GENERATOR FUNCTION
  const lineGen = d3.line()
    .x(d => xScale(d.Year))
    .y(d => yScale(d.Estimate))

    
    const areaGen = d3.area()
    .x(d => xScale(d.Year))
    .y1(d => yScale(d.Estimate))
    .y0(d => yScale(500000))


  // DRAW LINE

  // first, draw the area
  svg.selectAll(".area")
    .data([data])
    .join("path")
    .attr("class", 'area')
    .attr("fill", "purple")
    .attr("d", d => areaGen(d))

  // then, draw the line
    svg.selectAll(".line")
    .data([data]) // data needs to take an []
    .join("path")
    .attr("class", 'line')
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", 5)
    .attr("d", d => lineGen(d))


    
// then, add a tooltip
const tooltip = d3.select("#tooltip");

// then, draw circles for each data point
svg.selectAll("circle")
  .data(data)
  .join("circle")
  .attr("cx", d => xScale(d.Year))
  .attr("cy", d => yScale(d.Estimate))
  .attr("r", 6)
  .attr("fill", "steelblue")
  .on("mouseover", (event, d) => {
    const [x, y] = d3.pointer(event);
    const formatNumber = d3.format(",");
    tooltip.style("display", "block");
    tooltip.html("US homeless population estimate for " + d.Year + ": <strong>" + formatNumber(d.Estimate)+ "</strong>")
      .style("left", (x + 10) + "px")
      .style("top", (y - 20) + "px");
  })
  .on("mouseout", () => {
    tooltip.style("display", "none");
  });



});