const width = 900;
const height = 900;

const padding = 10;

const numStateCols = 2; // number of columns of state blocks
const numStateRows = 2; // number of rows of state blocks

const numColsPolicy = 2; // number of (policy) columns within state block
const numRowsPolicy = 2; // number of (policy) rows within state block
 
const blockHeight = 100;
const blockWidth = 80;

// based on predetermined row and column index (https://docs.google.com/spreadsheets/d/1otXRCqtpralMGWstBlecKwlJ0eia45Sgho_R6zvX8ow/edit?usp=sharing)
// the TranslateFactor converts index to x and y coordinate based on size of svg 
const widthTranslateFactor = width - (blockWidth * numColsPolicy) / (numStateCols - 1);
const heightTranslateFactor = height - (blockHeight * numRowsPolicy) / (numStateRows - 1);

const svg = d3.select(".map")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

const colScale = d3.scaleOrdinal()
    .range(["#7a36c2","#020005","#ebe70c", "#19a80c"])
    .domain("Abortion", "Death", "Marijuana", "Climate");

const div = d3.select(".map")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)

d3.csv("https://raw.githubusercontent.com/jessvoiture/state_policy/main/datasets/policy_test_data_long.csv", d3.autoType).then(function(data){
    
    console.log(data);

    const state_data = d3.group(data, d => d.State);

    console.log(state_data)    
  
    let plots = svg.selectAll("g")
      .data(state_data)
      .enter()
      .append("g")
      .attr("class", "state")
      .attr("transform", function(d) {
        // console.log(d[1][0].state_col) //  gets column of state block
        // console.log(d[1][0].state_row) // gets row of state block
        return "translate(" + [(d[1][0].state_col - 1) * widthTranslateFactor, (d[1][0].state_row - 1) * heightTranslateFactor] + ")";
      })

 

    plots
      .selectAll(".rect")
      .data(d => d[1])
      .enter()
      .append("rect")
      .attr("class", function(d) { return d.Policy})
      .attr("width", blockWidth)
      .attr("height", blockHeight)
      .attr("x", function(d, i){
        var colIndex = i % numColsPolicy
        return colIndex * blockWidth
      })
      .attr("y", function(d, i){
        var rowIndex = Math.floor(i/numColsPolicy)
        return rowIndex * blockHeight
      })
      .style("fill", function(d) { return colScale(d.Policy)})
      .style("opacity", function(d) { return d.Value})
    //   .on("mouseover", function(event, d) {
    //     div.transition()
    //         .duration(200)
    //         .style("opacity", 1)
    //     var element = d3.select(this)
    //     element.style("stroke", "Black")
    //     div.html("<span style = 'font-weight: bold'>" + d.Policy + "</span>" + "<br>" + 
    //              "<span style = 'font-style: italic'>" + d.Value + "% of the top cast is a nepo baby" + "</span>")
    //       .style("left", (event.pageX - 20) + "px")
    //       .style("top", (event.pageY - 30) + "px");
    //     })
    //   .on("mouseout", function(d) {
    //     div.transition()
    //         .duration(100)
    //         .style("opacity", 0);
    //     var element = d3.select(this)
    //     element.style("stroke", "none")
    //     });


})
