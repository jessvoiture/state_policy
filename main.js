const width = 900;
const height = 900;

const padding = 10;
const numStateCols = 2; // number of boxes in a waffle graph
const numColsPolicy = 2; // number of boxes in a waffle graph
 
const numColsState = 4; // number of columns for state boxes
 
const blockHeight = 100;
const blockWidth = 80;

const translateFactor = width / numStateCols


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
    
    // console.log(data);

    const state_data = d3.group(data, d => d.State);

    // console.log(state_data)    
    // console.log(state_data.get("A")[0].state_col)
  
    let plots = svg.selectAll("g")
      .data(state_data)
      .enter()
      .append("g")
      .attr("class", "state")
      .attr("transform", function(d, i) {
        console.log(d[1][0].state_col) //  gets column of state block
        console.log(d[1][0].state_row) // gets row of state block
        return "translate(" + [i * ((width - (blockWidth * numColsPolicy)) / (numColsState - 1)), padding] + ")";
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
