// This is a series of bar charts.

// Load and process the data
d3.csv("../data/CensusDataBarChart.csv").then(data => {
    console.log("Raw data:", data);
  
    // Initialize an object to hold the aggregated data by county
    const aggregatedData = {};
  
    // Function to clean and parse numerical data
    function cleanAndParse(value) {
      if (!value) return 0;
      const cleanedValue = value.toString().replace(/[^0-9.]/g, '');
      const parsedValue = parseFloat(cleanedValue);
      return isNaN(parsedValue) ? 0 : parsedValue;
    }
  
    // Aggregate the data by county
    data.forEach(d => {
      const county = d.County.trim();
  
      if (!aggregatedData[county]) {
        aggregatedData[county] = {
          County: county,
          "Total:": 0,
          "Total Owner occupied:": 0,
          "Owner occupied: Complete plumbing facilities": 0,
          "Owner occupied: Lacking plumbing facilities": 0,
          "Total Renter occupied:": 0,
          "Renter occupied: Complete plumbing facilities": 0,
          "Renter occupied: Lacking plumbing facilities": 0
        };
      }
  
      // Aggregate the values for each county
      aggregatedData[county]["Total:"] += cleanAndParse(d["Total:"]);
      aggregatedData[county]["Total Owner occupied:"] += cleanAndParse(d["Total Owner occupied:"]);
      aggregatedData[county]["Owner occupied: Complete plumbing facilities"] += cleanAndParse(d["Owner occupied: Complete plumbing facilities"]);
      aggregatedData[county]["Owner occupied: Lacking plumbing facilities"] += cleanAndParse(d["Owner occupied: Lacking plumbing facilities"]);
      aggregatedData[county]["Total Renter occupied:"] += cleanAndParse(d["Total Renter occupied:"]);
      aggregatedData[county]["Renter occupied: Complete plumbing facilities"] += cleanAndParse(d["Renter occupied: Complete plumbing facilities"]);
      aggregatedData[county]["Renter occupied: Lacking plumbing facilities"] += cleanAndParse(d["Renter occupied: Lacking plumbing facilities"]);
    });
  
    // Convert aggregated data into an array of objects
    const countyArray = Object.values(aggregatedData);
    console.log("Aggregated data for charts:", countyArray);
  
    // Specify the columns you want to create bar charts for
    const chartColumns = [
      "Total:",
      "Total Owner occupied:",
      "Owner occupied: Complete plumbing facilities",
      "Owner occupied: Lacking plumbing facilities",
      "Total Renter occupied:",
      "Renter occupied: Complete plumbing facilities",
      "Renter occupied: Lacking plumbing facilities"
    ];
  
    // Create a bar chart for each column
    chartColumns.forEach(column => {
      createBarChart(countyArray, column);
    });
  
    function createBarChart(data, column) {
      const margin = { top: 20, right: 20, bottom: 50, left: 60 };
      const width = 600 - margin.left - margin.right;
      const height = 400 - margin.top - margin.bottom;
  
      const svg = d3.select("#charts").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
  
      // Set up scales
      const x = d3.scaleBand()
        .domain(data.map(d => d.County))
        .range([0, width])
        .padding(0.1);
  
      const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d[column])])
        .nice()
        .range([height, 0]);
  
      // Draw the bars
      svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.County))
        .attr("y", d => y(d[column]))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d[column]))
        .attr("fill", "#69b3a2");
  
      // Add x-axis
      svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");
  
      // Add y-axis
      svg.append("g")
        .call(d3.axisLeft(y));
  
      // Add chart title
      svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 10)
        .attr("text-anchor", "middle")
        .text(column);
  
      // Add y-axis label
      svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Count");
    }
  }).catch(error => {
    console.error("Error loading or processing data:", error);
  });
  