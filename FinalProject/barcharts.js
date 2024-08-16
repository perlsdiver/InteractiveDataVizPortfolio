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
  currentView: "Total_no_plumbing:",
};

/// Main function to load data and draw the bar charts
function main() {
  d3.csv("../data/CensusDataBarChart.csv", d3.autoType)
    .then(barData => {
      state.barData = barData;
      // Initially draw the default chart (e.g., "Total:")
      drawBarChart(state.currentView);
    })
    .catch(error => {
      console.error("Failed to load data", error);
      alert("Error loading data. Please try again later.");
    });
}

window.addEventListener('DOMContentLoaded', function() {
  main();

  // Ensure the event listeners are attached after the DOM is fully loaded
  d3.selectAll(".data-view").on("click", function(event) {
    const selectedView = d3.select(this).attr("data-view");
    console.log("Button clicked: ", selectedView); // Debugging line
    state.currentView = selectedView;
    drawBarChart(selectedView);
  });
});

/// Function to aggregate data by County for the selected view
function aggregateData(view) {
  console.log("Aggregating data for view:", view);
  const aggregatedData = d3.rollup(
    state.barData,
    v => d3.sum(v, d => d[view]),
    d => d.County
  );
  
  // Convert the Map returned by d3.rollup back to an array of objects
  const result = Array.from(aggregatedData, ([County, total]) => ({ County, total }));
  console.log("Aggregated data:", result);
  return result;
}

/// Function to draw the bar chart based on the selected view
function drawBarChart(view) {
    console.log("Drawing chart for view: ", view); // Debugging line
  // Clear previous chart
  d3.select("#charts").selectAll("*").remove();

  const svg = d3.select("#charts").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Set up scales
  const x = d3.scaleBand()
    .domain(state.barData.map(d => d.County))
    .range([0, width - margin.left - margin.right])
    .padding(0.1);

  const y = d3.scaleLinear()
    .domain([0, d3.max(state.barData, d => d[view])])
    .range([height - margin.top - margin.bottom, 0])
    .nice();

// Defining a transition
const t = d3.transition()
.duration(750) // Set the duration of the transition (in milliseconds)
.ease(d3.easeCubicInOut); // Set the easing function for the transition

  // Draw bars
  svg.selectAll(".bar")
    .data(state.barData)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", d => x(d.County))
    .attr("y", d => y(d[view]))
    .attr("width", x.bandwidth())
    .attr("height", d => height - margin.top - margin.bottom - y(d[view]))
    .attr("fill", "#69b3a2")
    .transition(t)
    .attr("y", d => y(d.total)) // Transition to the correct position
    .attr("height", d => height - margin.top - margin.bottom - y(d.total)); // Apply the transition;
    

 // Add counts above bars
 // Still fixing this part
 svg.selectAll(".label")
 .data(aggregateData)
 .enter().append("text")
 .attr("class", "label")
 .attr("x", d => x(d.County) + x.bandwidth() / 2)
 .attr("y", height - margin.top - margin.bottom) // Start text from the bottom
 .attr("text-anchor", "middle")
 .attr("font-size", "1px")
 .attr("fill", "#000") // Text color
 .text(d => d[view])
 .transition(t) // Apply the transition
 .attr("y", d => y(d.total) - 5); // Move text to the correct position;

  // Add x-axis
  svg.append("g")
    .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
    .call(d3.axisBottom(x));

  // Add y-axis
  svg.append("g")
    .call(d3.axisLeft(y));

  // Add chart title
  svg.append("text")
    .attr("x", (width - margin.left - margin.right) / 2)
    .attr("y", height - margin.bottom)
    .attr("text-anchor", "middle")
    .text(view.replace(/_/g, " ")); // Replace underscores with spaces for better readability;

  // Add y-axis label
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height - margin.top - margin.bottom) / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Count");
}

// Event listener for selecting different views
d3.selectAll(".data-view").on("click", function(event) {
  const selectedView = d3.select(this).attr("data-view");
  console.log("Button clicked: ", selectedView); // Debugging line
  state.currentView = selectedView;
  drawBarChart(selectedView);
});
