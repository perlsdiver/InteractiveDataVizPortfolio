//////////////////////////
/// CONSTANTS AND GLOBALS ///
//////////////////////////
const width = window.innerWidth * 0.8,
      height = window.innerHeight * 0.8,
      margin = { top: 20, bottom: 50, left: 60, right: 40 };

//////////////////////////
/// APPLICATION STATE ///
/////////////////////////
let state = {
  barData: null,
  currentView: "Total lacking plumbing facilities", // Default view set to combined totals
};

/// Main function to load data and draw the bar charts
function main() {
  d3.csv("../data/CensusDataBarChartSum.csv", d3.autoType)
    .then(barData => {
      state.barData = barData;
      console.log("Summarized data successfully loaded:", barData);
      drawBarChart(state.currentView);
    })
    .catch(error => {
      console.error("Failed to load summarized data", error);
      alert("Error loading data. Please try again later.");
    });
}

window.addEventListener('DOMContentLoaded', function() {
  main();

  // Ensure the event listeners are attached after the DOM is fully loaded
  d3.selectAll(".data-view").on("click", function(event) {
    const selectedView = d3.select(this).attr("data-view");
    console.log("Button clicked", selectedView);
    state.currentView = selectedView;
    drawBarChart(selectedView);
  });
});

/// Function to draw the bar chart based on the selected view
function drawBarChart(view) {
  console.log("Drawing chart for view:", view);

  // Clear previous chart
  d3.select("#charts").selectAll("*").remove();

  // Filter the data based on the selected view
  const filteredData = state.barData
  .filter(d => d['Row Labels'] !== 'Grand Total')  // Exclude the "Grand Total" row
  .map(d => ({
    County: d['Row Labels'],  // Ensure you access the 'Row Labels' column correctly
    total: d[view] || 0 // Fallback to 0 if the value is undefined
  }));

  // Log the filtered data for debugging
  console.log("Filtered Data:", filteredData);

  const svg = d3.select("#charts").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Set up scales
  const x = d3.scaleBand()
    .domain(filteredData.map(d => d.County))
    .range([0, width - margin.left - margin.right])
    .padding(0.1);

  const y = d3.scaleLinear()
    .domain([0, d3.max(filteredData, d => d.total) || 0]) // Fallback to 0 if max is undefined
    .range([height - margin.top - margin.bottom, 0])
    .nice();

  const t = d3.transition()
    .duration(1000)
    .ease(d3.easeBounce)
    .delay((d, i) => i * 150); // Delay each bar's transition by 100ms;

  // Draw bars with transition
  svg.selectAll(".bar")
    .data(filteredData)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", d => x(d.County))
    .attr("y", d => y(d.total))
    .attr("width", x.bandwidth())
    .attr("height", d => height - margin.top - margin.bottom - y(d.total))
    .attr("fill", "#69b3a2")
    .transition(t)
    .attr("y", d => y(d.total))
    .attr("height", d => height - margin.top - margin.bottom - y(d.total));

  // Add totals above bars with transition
  svg.selectAll(".label")
    .data(filteredData)
    .enter().append("text")
    .attr("class", "label")
    .attr("x", d => x(d.County) + x.bandwidth() / 2)
    .attr("y", d => y(d.total) - 5)
    .attr("text-anchor", "middle")
    .attr("font-size", "12px")
    .attr("fill", "#000")
    .text(d => d.total);

  // Add x-axis
  svg.append("g")
    .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
    .call(d3.axisBottom(x));

  // Add y-axis
  svg.append("g")
    .call(d3.axisLeft(y));

  // Add y-axis label
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height - margin.top - margin.bottom) / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Units of Occupied Housing Without Plumbing");

  // Add x-axis label
  svg.append("text")
    .attr("x", (width - margin.left - margin.right) / 2)
    .attr("y", height - margin.bottom + 30)
    .attr("text-anchor", "middle")
    .attr("font-size", "14px")
    .text("Counties");
}
