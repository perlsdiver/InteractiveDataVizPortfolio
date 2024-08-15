//////////////////////////
/// CONSTANTS AND GLOBALS ///
//////////////////////////
const width = window.innerWidth * 0.9,
 height = window.innerHeight * 0.9,
 margin = { top: 20, bottom: 50, left: 60, right: 40 };

//////////////////////////
/// APPLICATION STATE ///
/////////////////////////
let state = {
  mapsvg: null,
  NYCtracts: null,
  plumbingData: null,
  currentView: null,
  zoomTransform: null, // Store the default transform
};

/// Main function to load data and draw the map
function main() {
  Promise.all([
    // JSON file taken from NYC Open Data
    d3.json("../data/CensusMerged.json"),

    // Census data, wrangled to be easier to read
    d3.csv("../data/CensusData.csv", d3.autoType),

  
  ])
    .then(([NYCtracts, plumbingData, barData]) => {
      state.NYCtracts = NYCtracts;
      state.plumbingData = plumbingData;

      drawMap();
    })
    .catch(error => {
      console.error("Failed to load data", error);
      alert("Error loading data. Please try again later.");
    });
}

window.addEventListener('DOMContentLoaded', main);

/// Event handler for mouseover
function TractMouseOver(event, tractData) {
  const tooltip = d3.select("#tooltip");

  // Calculate the total number of units
  const totalUnits = +tractData.properties.Total_Owner + +tractData.properties.Total_Renter;
  const unitsWithoutPlumbing = +tractData.properties.Owner_no_plumbing + +tractData.properties.Renter_no_plumbing;
  
  // Calculate percentage of units without plumbing
  const percentageWithoutPlumbing = totalUnits > 0 ? ((unitsWithoutPlumbing / totalUnits) * 100).toFixed(2) : "N/A";

  // Calculate owner versus renter percentages
  const ownerPercentage = totalUnits > 0 ? ((tractData.properties.Total_Owner / totalUnits) * 100).toFixed(2) : "N/A";
  const renterPercentage = totalUnits > 0 ? ((tractData.properties.Total_Renter / totalUnits) * 100).toFixed(2) : "N/A";

  // Update tooltip content
  tooltip.html(`
    <strong>Census Tract:</strong> ${tractData.properties.CDTA2020} - ${tractData.properties.CDTANAME}<br>
    <strong>Owner Occupied Units:</strong> ${tractData.properties.Total_Owner} (${ownerPercentage}%)<br>
    <strong>Renter Occupied Units:</strong> ${tractData.properties.Total_Renter} (${renterPercentage}%)<br>
    <strong>No plumbing (Owner / Renter):</strong> ${tractData.properties.Owner_no_plumbing} / ${tractData.properties.Renter_no_plumbing}<br>
    <strong>Percentage without plumbing:</strong> ${percentageWithoutPlumbing}% 
  `);

  // Position the tooltip and ensure correct sizing
  tooltip.style("left", (event.pageX + 10) + "px")
         .style("top", (event.pageY - 28) + "px")
         .style("display", "block")
         .style("max-width", "300px"); // Ensure tooltip box size is adequate
}

/// Event handler for mouseout
function TractMouseOut() {
  d3.select("#tooltip").style("display", "none");
}

/// Function to draw the map
function drawMap() {
  // Adaptive parameters for width and height
  const container = document.querySelector("#map");
  const width = container.clientWidth * 0.9; // 90% of container width
  const height = container.clientHeight * 0.9; // 90% of container height

  const mapsvg = d3.select("#map")
    .attr("width", width)
    .attr("height", height);

  // Define the diagonal hatch pattern for tracts with no occupied units
  mapsvg.append("defs")
    .append("pattern")
    .attr("id", "diagonalHatch")
    .attr("patternUnits", "userSpaceOnUse")
    .attr("width", 4)
    .attr("height", 4)
    .append("path")
    .attr("d", "M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2")
    .attr("stroke", "black")
    .attr("stroke-width", 1);

  // Define a clipPath to contain the map within the border
  mapsvg.append("defs").append("clipPath")
    .attr("id", "map-clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height);

  const projection = d3.geoMercator().fitSize([width, height], state.NYCtracts);

  const tractGroup = mapsvg.append("g")
    .attr("clip-path", "url(#map-clip)"); // Apply the clipPath to the map content

  const pathGenerator = d3.geoPath().projection(projection);

  // Updated color scale to handle tracts with zero occupied units and more granularity
  const colorScale = d3.scaleThreshold()
    .domain([1, 5, 15, 30, d3.max(state.NYCtracts.features, d => 
      +d.properties.Owner_no_plumbing + +d.properties.Renter_no_plumbing)])
    .range(["#ffe", "#ffd700", "#ff8c00", "#ff4500", "#f00", "#d3d3d3"]); // Add new colors and patterns

  tractGroup.selectAll("path")
    .data(state.NYCtracts.features)
    .enter()
    .append("path")
    .attr("d", pathGenerator)
    .attr("id", tract => `tract-id-${tract.id}`)
    .attr("stroke", "black")
    .attr("fill", data => {
      const totalUnits = +data.properties.Total_Owner + +data.properties.Total_Renter;
      if (totalUnits === 0) {
        return "url(#diagonalHatch)"; // Apply the pattern to tracts with no occupied units
      }
      return colorScale(+data.properties.Owner_no_plumbing + +data.properties.Renter_no_plumbing);
    })
    .on("mouseover", TractMouseOver)
    .on("mouseout", TractMouseOut)
    .on("mousemove", TractMouseOver); // Update tooltip position on mouse move

  // Adding zoom functionality
  const zoom = d3.zoom()
    .scaleExtent([0.75, 10])
    .on('zoom', (event) => {
      tractGroup.attr('transform', event.transform);
      state.zoomTransform = event.transform; // Store the current zoom transform
    });

  mapsvg.call(zoom);
  state.zoomTransform = d3.zoomIdentity; // Store the default zoom transform

// Calculate the adjusted width and height
const adjustedWidth = width - 5;  // Subtract stroke-width from width
const adjustedHeight = height - 5; // Subtract stroke-width from height

// Add a framing border around the map
mapsvg.append("rect")
  .attr("width", adjustedWidth)
  .attr("height", adjustedHeight)
  .attr("x", 2.5) // Offset by half the stroke width to ensure the border is inside the SVG
  .attr("y", 2.5) // Offset by half the stroke width to ensure the border is inside the SVG
  .attr("stroke", "gray")
  .attr("stroke-width", "5px")
  .attr("fill", "none");


  // Add the color density scale (legend)
  addColorScaleLegend(mapsvg, colorScale, width, height);

  // Add event listener for the reset button
  d3.select("#reset-btn").on("click", () => {
    mapsvg.transition()
      .duration(750)
      .call(zoom.transform, d3.zoomIdentity); // Reset the zoom to the default transform
  });
}

/// Function to add a color scale legend
function addColorScaleLegend(svg, colorScale, width, height) {
  const legendWidth = 300;
  const legendHeight = 100;
  const padding = 10;

  const legendGroup = svg.append("g")
    .attr("transform", `translate(${width - legendWidth - 60}, ${height - legendHeight - 80})`);

  // Add a background box to contain the legend
  legendGroup.append("rect")
    .attr("width", legendWidth + padding * 2)
    .attr("height", legendHeight * 2 + padding * 2)
    .attr("x", -padding)
    .attr("y", -padding)
    .attr("fill", "#f9f9f9")  // Light background color
    .attr("stroke", "#ccc")   // Border color
    .attr("stroke-width", 1)
    .attr("rx", 8)            // Rounded corners
    .attr("ry", 8);

  const legendLabels = ["No Issues", "1-5 Issues", "6-15 Issues", "16-30 Issues", "31+ Issues", "No Occupied Units (Hatched)"];
  const legendColors = ["#ffe", "#ffd700", "#ff8c00", "#ff4500", "#f00", "url(#diagonalHatch)"];

  const legendScale = d3.scaleBand()
    .domain(legendLabels)
    .range([0, legendWidth])
    .padding(0.1);

  legendGroup.selectAll("rect.color-legend")
    .data(legendColors)
    .enter().append("rect")
    .attr("class", "color-legend")
    .attr("x", (d, i) => i * legendWidth / legendColors.length)
    .attr("y", 0)
    .attr("width", legendWidth / legendColors.length)
    .attr("height", legendHeight)
    .attr("fill", d => d);

  legendGroup.selectAll("text.legend-label")
    .data(legendLabels)
    .enter().append("text")
    .attr("class", "legend-label")
    .attr("x", (d, i) => i * legendWidth / legendLabels.length + (legendWidth / legendLabels.length) / 2)
    .attr("y", legendHeight + 15)
    .attr("text-anchor", "middle")
    .attr("font-size", "12px") // Adjust font size
    .attr("transform", (d, i) => `rotate(-90, ${i * legendWidth / legendLabels.length + (legendWidth / legendLabels.length) / 2}, ${legendHeight + 5})`)
    .attr("fill", "#333")       // Darker text color for readability
    .text(d => d);
}
