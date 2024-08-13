let state = {
  mapsvg: null,
    NYC_tracts: null,
    plumbingData: null,
    barData: null,
  currentView: null,
};

// d is event, i is tract
function TractMouseOver(rawevent, tractData) {
  d3.select("#CDTA2020").text(tractData.properties.CDTA2020 + "-" + tractData.properties.CDTANAME)
  d3.select("#owner-to-renter").text(`${tractData.properties.Total_Owner} / ${tractData.properties.Total_Renter}`)
  d3.select("#no-plumbing").text(`${tractData.properties.Owner_no_plumbing} / ${tractData.properties.Renter_no_plumbing}`)
}

function TracktMouseOut(d, i) {
  // TODO clean dd in data table
}


function drawMap() {
  const width = document.querySelector("#map").clientWidth
  const height = document.querySelector("#map").clientHeight
  const mapsvg = d3.select("#map")
	const projection = d3.geoMercator().fitSize([width, height], state.NYCtracts);
  // creating 'g' for the map's tracts.
  const g = mapsvg.append("g");
  const pathGenerator = d3.geoPath().projection(projection);
  g.selectAll("path")
    .data(state.NYCtracts.features)
    .enter()
    .append("path")
    .attr("d", pathGenerator)
    .attr("id", (tract)=>{
      return "tract-id-" + tract.id;
    })
    .attr("stroke", "black")
    .attr("fill", (data)=>{
      if (data.properties.Owner_no_plumbing == "0" && data.properties.Renter_no_plumbing == "0") {
        return "#ffe";
      }
      return "#ff0";

    })
    .on("mouseover", TractMouseOver)
    .on("mouseout", TracktMouseOut);

   // Adding ability to zoom
  const zoom = d3.zoom()
    .scaleExtent([0.75, 10])
    .on('zoom', (event) => {
      g.attr('transform', event.transform);
    });

   // Add a framing border around the map
  mapsvg.append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("stroke", "green") // Border color
    .attr("stroke-width", "5px") // Border width
    .attr("fill", "none");

  mapsvg.call(zoom);

};

function main() {
  Promise.all([
    // json file taken from NYC Open Data
    d3.json("data/CensusMerged.json"),

  // census data, wrangled to be easier to read
   d3.csv("data/CensusData.csv", d3.autotype),

  // seperate file made of borough-level summary data, making it easier to render bar charts
   d3.csv("data/CensusDataBarChartSum.csv", d3.autoType),

  ]).then(([NYCtracts , plumbingData, barData ]) => {
    state.NYCtracts = NYCtracts;
    state.plumbingData = plumbingData;
    state.barData = barData;
    drawMap();
  }).catch(error =>[
    console.error("Failed to load data", error)
  ]);
}

window.addEventListener('DOMContentLoaded', main)
