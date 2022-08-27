const legend_keys = [
  { Policy: 'Abortion', Source: "Guttmacher", Metric: "Gestational limits on abortion"},
  { Policy: 'Climate Action', Source: "See individual states", Metric: "Presence of a climate action plan"},
  { Policy: 'Death Penalty', Source: "Death Penalty Information Center", Metric: "Legality of the death penalty"},
  { Policy: 'Guns', Source: "Giffords", Metric: "Restrictions on assault weapons"},
  { Policy: 'Healthcare', Source: "Medicaid", Metric: "Medicaid coverage to people who earn more than the federal poverty level (FPL)"},
  { Policy: 'Homelessness', Source: "National Alliance to End Homelessness", Metric: "Homelessness per 10,000"},
  { Policy: 'LGBTQ+ Rights', Source: "Human Rights Center", Metric: "Score on the HRC State Equality Index"},
  { Policy: 'Incarceration', Source: "The Sentencing Project", Metric: "Incarceration per capita"},
  { Policy: 'Marijuana', Source: "Wikipedia (it had good info)", Metric: "Legality of Marijuana"},
  { Policy: 'Maternity Leave', Source: "National Partnership for Women & Families", Metric: "Maternity leave guaranteed by the State"},
  { Policy: 'Minimum Wage', Source: "Department of Labor", Metric: "Basic minimum rate per hour"},
  { Policy: 'Police', Source: "8 Can't Wait", Metric: "Score on 8 Can't Wait policies"}
];

const width = 800;
const height = 600;

const padding = 11;
const labelBoxSpace = 2; // space in between the State label and the State Plot
const labelPadding = padding - labelBoxSpace;

const numStateCols = 11; // number of columns of state blocks
const numStateRows = 8; // number of rows of state blocks

const numColsPolicy = 4; // number of (policy) columns within state block
const numRowsPolicy = 3; // number of (policy) rows within state block
 
const blockHeight = 19;
const blockWidth = 16;

// based on predetermined row and column index (https://docs.google.com/spreadsheets/d/1otXRCqtpralMGWstBlecKwlJ0eia45Sgho_R6zvX8ow/edit?usp=sharing)
// the TranslateFactor converts index to x and y coordinate based on size of svg 
const widthTranslateFactor = (width - (blockWidth * numColsPolicy)) / (numStateCols - 1);
const heightTranslateFactor = ((height-padding) - (blockHeight * numRowsPolicy)) / (numStateRows - 1);

const svg = d3.select(".map")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

const colScale = d3.scaleOrdinal()
    .range(["#7a36c2","#5c4811","#ebe70c", "#1453db", "#19a80c", "#db14ad","#b2de14", "#2b2b28", "#c41d1d", "#18c9bb", "#2411d1", "#d17411"])
    .domain(["Abortion", "Death Penalty", "Marijuana", "Guns", "Climate Action", "Maternity Leave", "Minimum Wage", "Incarceration", "Homelessness", "Healthcare", "Police", "LGBTQ+ Rights"]);

const leg_det = d3.select(".policy_det")
    // .append("ul")
    .attr("class", "policy_list")
    .style("opacity", 1)
    .text("Hover over the grid below to see which policy is which color");

const cite_source = d3.select(".cite_source")
    .style("opacity", 0)
    .text("sources go here");

const div = d3.select(".map")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

const legendBlockWidth = 2.1 * blockWidth;
const legendBlockHeight = 2.1 * blockHeight;

const legendWidth = legendBlockWidth * numColsPolicy;
const legendHeight = legendBlockHeight * numRowsPolicy;

const legend = d3.select('.legend_graphic')
    .append("svg")
    .attr("width", legendWidth)
    .attr("height", legendHeight);

d3.csv("https://raw.githubusercontent.com/jessvoiture/state_policy/main/datasets/policy_final.csv?version=123", d3.autoType).then(function(data){
    
    console.log(data);

    const state_data = d3.group(data, d => d.State);
    const policy_data = d3.group(data, d => d.Policy);
  
    let plots = svg.selectAll("g")
        .data(state_data)
        .enter()
        .append("g")
        .attr("class", "state")
        .attr("id", function(d) { return d[1][0].Code + "-plot"; })
        .attr("transform", function(d) {
          // console.log(d[1][0].state_col) //  gets column of state block
          // console.log(d[1][0].state_row) // gets row of state block
          return "translate(" + [(d[1][0].state_col) * widthTranslateFactor, 
                                ((d[1][0].state_row) * heightTranslateFactor) + padding] // add in padding so that top row labels will be visible
                                + ")";
          });

    plots
        .selectAll(".rect")
        .data(d => d[1])
        .enter()
        .append("rect")
        .attr("class", function(d) { return d.Policy.replaceAll(' ', '_');})
        .attr("id", function(d) { return d.Code + "-" + d.Policy.replaceAll(' ', '_')})
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
        .style("fill", function(d) { return colScale(d.Policy) })
        .style("fill-opacity", function(d) { return d.Value })
        .style("stroke", "none")
        .on("mouseover", function(event, d) {

          div.transition()
              .duration(100)
              .style("opacity", 1);

          var element = d3.select(this);
          element.style("stroke", "Red");

          div.html("<span class = state_tooltip_heading style = 'font-weight: bold'>" + d.State + ": " +  d.Policy + "</span>" + "<br>" +
                  "<span class = state_tooltip_content style = 'font-style: italic'>" + d.Detail + "</span>")
              // .style("left", (element.attr("x") + x_trans) + "px")
              // .style("top", (element.attr("y") + y_trans) + "px");
              .style("left", (event.pageX - 150) + "px")
              .style("top", (event.pageY - 700) + "px");
              // .attr("transform", "translate(" + [x_trans,  y_trans] + ")");
          })
          
      .on("mouseout", function(d) {
          div.transition()
              .duration(100)
              .style("opacity", 0);
          var element = d3.select(this)
          element.style("stroke", "none")
          });

    const labels = svg
        .selectAll(".label")
        .data(state_data)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("transform", function(d) {
          // console.log(d[1][0].state_col) //  gets column of state block
          // console.log(d[1][0].state_row) // gets row of state block
          return "translate(" + [d[1][0].state_col * widthTranslateFactor, 
                                 d[1][0].state_row * heightTranslateFactor + labelPadding] // translate by labelPadding so that top row labels are visible
                                 + ")";
          })
        .style("text-anchor", "left")
        .text(function(d) { return d[1][0].Code; });

    legend
        .selectAll('legend')
        .data(legend_keys)
        .enter()
        .append("rect")
        .attr("class", 'legend')
        .attr("width", legendBlockWidth)
        .attr("height", legendBlockHeight)
        .attr("x", function(d, i){
            var colIndex = i % numColsPolicy
            return colIndex * legendBlockWidth
            })
        .attr("y", function(d, i){
            var rowIndex = Math.floor(i/numColsPolicy)
            return rowIndex * legendBlockHeight
            })
        .style("fill", function(d) { return colScale(d.Policy) })
        .on("mouseover", onMouseover)
        .on("mouseout", onMouseout);

    function onMouseover(e, d) {

        var element = d3.select(this)
        element.style("stroke", "Red") 

        var chosen = d.Policy;
        var chosenColor = colScale(chosen);

        // map display  
        // highlight the policy rect which match the fill color of the legend rect
        d3.selectAll("rect")
          // .selectAll(("." + d.Policy.replaceAll(' ', '_')))
          .each(function(d){ policy = d3.select(this); 
                            if (rgbToHex(policy.style("fill")) != chosenColor) { 
                              policy.style("fill-opacity", 0.05)
                            } else {
                              policy.style("stroke", "Red")
                            }
                            });

        // legend display  
        leg_det
           .style("opacity", 1)
           .text(d.Policy + ": " + d.Metric);

        cite_source
           .style("opacity", 1)
           .text("Source: " + d.Source);

       }

    function onMouseout() {
            
        var element = d3.select(this)
        element.style("stroke", "none")

        leg_det
          .style("opacity", 1)
          .text("Hover over the grid below to see which policy is which color")

        cite_source
          .style("opacity", 0);

        drawRestingState()
      }
     
    // on Legend mouseout redraw the policy rects with the correct opacity 
    function drawRestingState(){
        plots
          .selectAll("rect")
          .style("fill-opacity", function(d) { return d.Value })
          .style("stroke", "none");

        legend
          .selectAll("rect")
          .style("fill-opacity", 1)
    } 

    // Convert rgb to hex
    // in order to highlight policy rect in states from the legend mouseover, need to match color 
    // mouseover returns color as hex but rect return color as rgb
    function componentFromStr(numStr, percent) {
        var num = Math.max(0, parseInt(numStr, 10));
        return percent ?
            Math.floor(255 * Math.min(100, num) / 100) : Math.min(255, num);
    }
    
    function rgbToHex(rgb) {
        var rgbRegex = /^rgb\(\s*(-?\d+)(%?)\s*,\s*(-?\d+)(%?)\s*,\s*(-?\d+)(%?)\s*\)$/;
        var result, r, g, b, hex = "";
        if ( (result = rgbRegex.exec(rgb)) ) {
            r = componentFromStr(result[1], result[2]);
            g = componentFromStr(result[3], result[4]);
            b = componentFromStr(result[5], result[6]);
    
            hex = "#" + (0x1000000 + (r << 16) + (g << 8) + b).toString(16).slice(1);
        }
        return hex;
    }
})
