/* here I made a dynamic table that can be transposed
// a very simple form of visualization we didn't explore in class
// but one that I wanted to learn to do, and also one that is likely useful
// in government policy-making
*/

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
  
    // Calculate the percentages for each county
    for (let county in aggregatedData) {
      const data = aggregatedData[county];
      const totalPlumbingIssues = data["Owner occupied: Lacking plumbing facilities"] + data["Renter occupied: Lacking plumbing facilities"];
    
    // Calculate the percentages
      const percentageOwnerPlumbingIssues = data["Total Owner occupied:"] > 0 ? (data["Owner occupied: Lacking plumbing facilities"] / data["Total Owner occupied:"]) * 100 : 0;
      data["Percentage Owner Occupied with Plumbing Issues"] = percentageOwnerPlumbingIssues.toFixed(4) + "%"; // Four decimal places
  
      const percentageRenterPlumbingIssues = data["Total Renter occupied:"] > 0 ? (data["Renter occupied: Lacking plumbing facilities"] / data["Total Renter occupied:"]) * 100 : 0;
      data["Percentage Renter Occupied with Plumbing Issues"] = percentageRenterPlumbingIssues.toFixed(4) + "%"; // Four decimal places
    
      const percentageWithPlumbingIssues = data["Total:"] > 0 ? (totalPlumbingIssues / data["Total:"]) * 100 : 0;
      data["Total Percentage with Plumbing Issues"] = percentageWithPlumbingIssues.toFixed(4) + "%"; // Four decimal places

    }
  
    // Convert the aggregated data into an array of objects
    const countyArray = Object.values(aggregatedData);
    console.log("Aggregated data for table:", countyArray);
  
    // Dynamically generate the table based on the aggregated columns
    const columns = Object.keys(countyArray[0]);
  
    // Append the button dynamically to the body
    d3.select("body").append("button")
      .attr("id", "transpose-button")
      .text("Transpose Table");
  
    const table = d3.select("body").append("div").attr("id", "table-container").append("table").attr("class", "sortable");
  
    let transposed = false;  // Track whether the table is transposed
  
    function createTable(data, cols, transposed = false) {
      
    // Clear existing table
      table.selectAll("*").remove();
  
      // Create table header
      const thead = table.append("thead").append("tr")
        .selectAll("th")
        .data(cols)
        .enter().append("th")
        .text(d => (transposed && d === "Header") ? "" : d)  // Display blank header in transposed state
        .style("font-weight", "bold") // Make headers bold
        .on("click", function (event, d) {
          const ascending = d3.select(this).classed("ascending");
          d3.select(this).classed("ascending", !ascending);
          d3.select(this).classed("descending", ascending);
  
          table.select("tbody").selectAll("tr").sort((a, b) => {
            if (ascending) {
              return d3.ascending(a[d], b[d]);
            } else {
              return d3.descending(a[d], b[d]);
            }
          });
        });
  
      // Create table body
      const tbody = table.append("tbody");
  
      const rows = tbody.selectAll("tr")
        .data(data)
        .enter().append("tr");
  
      rows.selectAll("td")
        .data(d => cols.map(column => d[column]))
        .enter().append("td")
        .text(d => d);
  
      // Reapply bold style and sorting functionality after transposing
      if (transposed) {
        thead.style("font-weight", "bold");
      }
    }
  
    // Initial table creation
    createTable(countyArray, columns);
  
    // Button to transpose rows and columns
    d3.select("#transpose-button")
      .on("click", function () {
        if (!transposed) {
          // Transpose logic
          const transposedData = columns.map((col, i) => {
            const newRow = { "Header": col }; // Use the column name as the row header
            countyArray.forEach((row, j) => {
              newRow[Object.values(aggregatedData)[j].County] = row[col];
            });
            return newRow;
          });
          const transposedColumns = ["Header", ...Object.keys(aggregatedData)]; // The new columns are the counties
  
          createTable(transposedData, transposedColumns, true);
  
          transposed = true;
        } else {
          // Revert to original layout
          createTable(countyArray, columns);
          transposed = false;
        }
      });
  
    console.log("Table generated successfully.");
  }).catch(error => {
    console.error("Error loading or processing data:", error);
  });
  