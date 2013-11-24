var m = 55;

var data = d3.range(8,m).map(function(d,i){
  return {
    y: 13500/d,
    x: d
  }
});

var format = d3.format(".3r");


var margin = {top: 47.5, right: 45, bottom: 70, left: 90},
    width = 620 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width])
    // .clamp(true);

var y = d3.scale.linear()
    .range([height, 0])
    // .clamp(true);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(5);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(5);

var line = d3.svg.line()
    .x(function(d) { return x(d.x); })
    .y(function(d) { return y(d.y); });

var svg = d3.select("#lineChart").append("svg")
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

x.domain([0,m]);
y.domain([0,1800]);

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
.append("text")
  // .attr("transform", "rotate(-90)")
  .attr("x", width - 5)
  .attr("dy", "3em")
  .style("text-anchor", "end")
  .text("mpg");

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
  .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "-5em")
    .style("text-anchor", "end")
    .text("gallons/year");


svg.append("path")
    .datum(data)
    .attr("class", "line")
    .attr("d", line);

var circle = svg
    .append("g")
    .attr("class","g-circles")
    .selectAll("circle")
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

var div = d3.select("body").append("div")   
    .attr("class", "tooltip")               
    .style("opacity", 0);

// var animDuration = 500;

var chart = {};

circle.on("mouseover", function(d){

  d3.select(this).transition().duration(100).attr("opacity", 1)

 div.transition()        
     .duration(100)      
     .style("opacity", .9);   

 div .html("mpg:  "   + d3.round(d.x)  + "<br/>" + "gallons/year: " + format(d.y))  
     .style("left", (d3.event.pageX + 10) + "px")     
     .style("top", (d3.event.pageY - 65) + "px");

}).on("mouseout",function(){

  d3.select(this).transition().duration(150).attr("opacity", 0)

      div.transition()        
                .duration(500)      
                .style("opacity", 0); 

})

var divSlider = d3.select("body").append("div").attr("id","slider");

var sliderCall = d3.slider().on("slide", slide).axis( d3.svg.axis().orient("top").ticks(0) ).max(m-10).min(8).step(.5).value(15);

divSlider
    .style({
      width: width - x(18) + "px",
      "margin-top": -45 + "px",
      "margin-left": margin.left + x(8) + "px"
    });

d3.select('#slider').call(sliderCall);

var diffGroup = svg.append("g").attr("class","diffGroup");

var val = 15;

var xa = x(val),
  xb = x(val + 10),
  ya = y(13500/val),
  yb = y(13500/(val+10));

//line to y axis
var diffLine = diffGroup.append("line")
    .attr({
        x1: xa,
        y1: ya,
        x2: xb,
        y2: yb,
        class: "reach neutral"
      });

var xLineA = diffGroup.append("line")
    .attr({
        x1: xa,
        y1: ya,
        x2: xa,
        y2: y(0),
        class: "reach current",
        stroke: "#2ecc71"
      })

var yLineA = diffGroup.append("line")
    .attr({
        x1: xa,
        y1: ya,
        x2: x(0),
        y2: ya,
        class: "reach current"
      })

var xLineB = diffGroup
  .append("line")
      .attr({
          x1: xb,
          y1: yb,
          x2: xb,
          y2: y(0),
          class: "reach replacement"
        })

var yLineB = diffGroup
  .append("line")
      .attr({
          x1: xb,
          y1: yb,
          x2: x(0),
          y2: yb,
          class: "reach replacement"
        });


var yTextGA = diffGroup.append("g")
  .attr("class","value-label")
  .attr("transform","translate(" + 0 + "," + ya + ")");

yTextGA.append("rect")
  .attr({
    x: 5,
    y: -30,
    rx: 3,
    width: 40,
    height: 25,
  })

var yTextGAText = yTextGA.append("text")
  .text(format(13500/15))
  .attr({
    x: 12.5,
    y: -12.5
  });

var yTextGB = diffGroup.append("g")
  .attr("class","value-label")
  .attr("transform","translate(" + 0 + "," + yb + ")");

yTextGB.append("rect")
  .attr({
    x: 5,
    y: 5,
    rx: 3,
    width: 40,
    height: 25,
  });

var yTextGBText = yTextGB.append("text")
  .text(format(13500/25))
  .attr({
    x: 12.5,
    y: 22.5
  });

//========
var xTextGA = diffGroup.append("g")
  .attr("class","value-label")
  .attr("transform","translate(" +  xa  + "," + y(0) + ")");

xTextGA.append("rect")
  .attr({
    x: -35,
    y: -30,
    rx: 3,
    width: 30,
    height: 25,
  })

var xTextGAText = xTextGA.append("text")
  .text(d3.round(val))
  .attr({
    x: -12.5,
    y: -12.5
  })
  .style("text-anchor", "end");

var xTextGB = diffGroup.append("g")
  .attr("class","value-label")
  .attr("transform","translate(" +  xb  + "," + y(0) + ")");

xTextGB.append("rect")
  .attr({
    x: 5,
    y: -30,
    rx: 3,
    width: 30,
    height: 25,
  });

var xTextGBText = xTextGB.append("text")
  .text(d3.round(val+10))
  .attr({
    x: 12.5,
    y: -12.5
  })
  .style("text-anchor", "start");

//======

var yDiffText = diffGroup.append("g")
  .attr("class","difference")
  .attr("transform", "translate(" + (-5) + "," + (yb + ya)/2 + ")");

yDiffText.append("rect")
  .attr({
    width: 45,
    height: 25,
    y: -12.5,
    x: 30,
    rx: 3
  });

var t = yDiffText
  .append("text")
    .text(format((ya) - (yb)))
    .attr("dy","5px")
    .attr("dx","35px");


//====

var xDiffText = diffGroup.append("g")
  .attr("class","difference")
  .attr("transform", "translate(" +  (xa + xb)/2 + "," + (y(0) - 10) + ")");

xDiffText.append("rect")
  .attr({
    width: 30,
    height: 25,
    y: -32.5,
    x: -15,
    rx: 3
  })

xDiffText
  .append("text")
    .text("10")
    .attr("dx","-7.5px")
    .attr("dy","-15px");


//====

var yArrowGroup = diffGroup
  .append("g")
    .classed("arrow", true)
    .attr( "transform", "translate(" + 15 + "," + yb + ")" );

var yGapLine = yArrowGroup
  .append("line")
    .attr({
      x1: 0,
      y1: ya - yb+3,
      x2: 0,
      y2: -3,
      class: "neutral"
    });

yArrowGroup
  .append("path")
    .attr("class", "arrowHead")
    .attr("d","M0,-3 L-5,-10 M5,-10 L0,-3")
//====

//====
var xArrowGroup = diffGroup
  .append("g")
    .classed("arrow", true)
    .attr( "transform", "translate(" + xb + "," + (y(0)-7.5) + ")" );

var xGapLine = xArrowGroup
  .append("line")
    .attr({
      x2: -3,
      x1: xa - xb + 3,
      y1: 0,
      y2: 0,
      class: "neutral"
    });

xArrowGroup
  .append("path")
    .attr("d","M0,-3 L-5,-10 M5,-10 L0,-3")
    .attr("transform","rotate(-90)")
    .attr("class", "arrowHead")
//====

//===

var col = {"curent": "#2ecc71", "replacement":  "#3498db"}

var legend = svg.selectAll(".legend")
    .data(d3.keys(col))
  .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

legend.append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", function(d){return col[d]; });

legend.append("text")
    .attr("x", width - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function(d) { return d; });

//===

function slide(event, val){

var xa = x(val),
  xb = x(val + 10),
  ya = y(13500/val),
  yb = y(13500/(val+10));

  diffLine.attr({
    x1: xa,
    y1: ya,
    x2: xb,
    y2: yb
  });

  xLineA.attr({
    x1: xa,
    y1: ya,
    x2: xa,
    y2: y(0)
  });

  yLineA.attr({
    x1: xa,
    y1: ya,
    x2: x(0),
    y2: ya
  });

  xLineB.attr({
    x1: xb,
    y1: yb,
    x2: xb,
    y2: y(0)
  });

  yLineB.attr({
    x1: xb,
    y1: yb,
    x2: x(0),
    y2: yb
  });

  yDiffText.attr("transform", "translate(" + 0 + "," + (ya + yb)/2 + ")");

  t.text(
    format(ya - yb)
    );

  if((13500/val) >= 1000) yTextGA.selectAll("rect").attr("width","47.5px")  
  if((13500/val) < 1000) yTextGA.selectAll("rect").attr("width","40px")  

  xDiffText.attr("transform", "translate(" +  (xa + xb)/2 + "," + (y(0) - 10) + ")");

  yArrowGroup.attr("transform", "translate(" + 15 + "," + yb + ")" );

  yGapLine.attr("y1", ya - yb + 3);

  xArrowGroup.attr("transform", "translate(" + xb + "," + (y(0)-7.5) + ")" );

  xGapLine.attr("x1", xa - xb + 3);

  yTextGAText.text(format(13500/val));
  yTextGBText.text(format(13500/(val+10)));
  xTextGAText.text(d3.round(val,0));
  xTextGBText.text(d3.round(val+10,0));

  yTextGA.attr("transform","translate(" + 0 + "," + ya + ")");
  yTextGB.attr("transform","translate(" + 0 + "," + yb + ")");
  xTextGA.attr("transform","translate(" + xa + "," + y(0) + ")");
  xTextGB.attr("transform","translate(" + xb + "," + y(0) + ")");


}


