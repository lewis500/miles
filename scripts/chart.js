var m = 55;

var data = d3.range(1,m).map(function(d,i){
  return {
    y: 10000/d,
    x: d
  }
});

var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 620 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width])
    // .clamp(true);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
    .x(function(d) { return x(d.x); })
    .y(function(d) { return y(d.y); });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var background = svg.append("rect")
  .attr({
    width: width,
    height: height,
    fill: "black",
    opacity: 0
  });

x.domain([0,50]);
y.domain([0,1200]);

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
.append("text")
  // .attr("transform", "rotate(-90)")
  .attr("x", width - 10)
  .attr("dy", "-.35em")
  .style("text-anchor", "end")
  .text("miles per gallon");

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
  .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("gallons per 10,000 miles");


svg.append("path")
    .datum(data)
    .attr("class", "line")
    .attr("d", line);



var circle = svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr({
        cx: function(d,i){ return x(d.x)},
        cy: function(d,i){ return y(d.y)},
        r: 5,
        fill: "#444",
        opacity: 0,
        class: "dot",
        "stroke-opacity":0,
        "stroke-width": "8px",
        stroke: 'black'
    });

var animDuration = 500;

var chart = {};

circle.on("mouseover", function(){

  var selectedShape = d3.select(this);

  if (chart.tooltipGroup !== null && chart.tooltipGroup !== undefined) {
    chart.tooltipGroup.remove();
  }

  chart.tooltipGroup = svg.append("g");

  selectedShape.transition()
      .duration(100)
      .attr("opacity",.8);

   var cx = parseFloat(selectedShape.attr("cx")),
      cy = parseFloat(selectedShape.attr("cy")),
      fill = selectedShape.attr("stroke");

  //MAKE SURE TO HAT-TIP DIMPLE.JS

  //line to x axis
  chart.tooltipGroup.append("line")
     .attr("x1", cx)
     .attr("y1", cy)
     .attr("x2", cx)
     .attr("y2", cy)
     .style("fill", "none")
     .style("stroke", "#444")
     .style("stroke-width", 2)
     .style("stroke-dasharray", ("3, 3"))
     // .style("opacity", opacity)
     .transition()
         // .delay(animDuration / 2)
         .duration(animDuration / 2)
         .ease("linear")
             // Added 1px offset to cater for svg issue where a transparent
             // group overlapping a line can sometimes hide it in some browsers
             // Issue #10
             .attr("y2", height);

  //line to y axis
  chart.tooltipGroup.append("line")
     .attr("x1", cx)
     .attr("y1", cy)
     .attr("x2", cx)
     .attr("y2", cy)
     .style("fill", "none")
     .style("stroke", "#444")
     .style("stroke-width", 2)
     .style("stroke-dasharray", ("3, 3"))
     // .style("opacity", opacity)
     .transition()
         // .delay(animDuration / 2)
         .duration(animDuration / 2)
         .ease("linear")
             // Added 1px offset to cater for svg issue where a transparent
             // group overlapping a line can sometimes hide it in some browsers
             // Issue #10
             .attr("x2", 0);

}).on("mouseout",function(){
    d3.select(this).transition()
        .duration(100)
        .attr("opacity",0);
    if (chart.tooltipGroup !== null && chart.tooltipGroup !== undefined) {
        chart.tooltipGroup.remove();
    }
})

var linesearch = false;

circle.on("click", function(){

  if(linesearch){
    chart.diffGroup = svg.append("line")
  }

  var selectedShape = d3.select(this);

  var cx = parseFloat(selectedShape.attr("cx")),
     cy = parseFloat(selectedShape.attr("cy")),
     fill = selectedShape.attr("stroke");

  //line to x axis
  chart.diffGroup = svg.append("line")
     .attr("x1", cx)
     .attr("y1", cy)
     .attr("x2", cx)
     .attr("y2", cy)
     .style("fill", "none")
     .style("stroke", "#444")
     .style("stroke-width", 2)
     // .style("stroke-dasharray", ("3, 3"))

  linesearch = true;

});

background.on("click", function(){
  if(linesearch){
     d3.selectAll(chart.diffGroup[0]).remove();
    console.log('hello')
  } 
})

background.on("mousemove", function(){

  if(linesearch){
    var m = d3.mouse(this);
      d3.selectAll(chart.diffGroup[0])
        .attr("x2", m[0])
        .attr("y2", m[1])
  }

})
