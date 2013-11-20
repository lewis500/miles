var margin = {top: 20, right: 20, bottom: 30, left: 80},
    width = 300 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var mYear = 10000,
  mpg = 15,
  maxMpg = 50;

var gYear = mYear/mpg;

var y = d3.scale.linear()
    .range([height, 0]);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    // .ticks(10, "%");

function xMpg(v){
  return mYear/v;
}

function xGpm(v){
  return v * mYear / 100; //its just 10000 miles/100 miles times gphm
}

// xMpg.domain([mpg,maxMpg]);
// xGpm.domain([mYear/mpg,mYear/maxMpg]);

y.domain([0, gYear]);

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
  .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("gallons used");

var backBar = svg.append("rect")
  .attr({
    class: "back bar",
    height: height,
    y: 0,
    x: 0,
    width: width - 150
  });

var frontBar = svg.append("rect")
  .attr({
    class: "front bar",
    height: 0,
    y: 0,
    x: 0,
    width: width - 150
  });  

var divSliderMpg = d3.select("body").append("div").attr("id","mpgSlider");

var sliderCallMpg = d3.slider().on("slide", slideMpg).axis( d3.svg.axis().orient("top").ticks(8) ).min(mpg).max(maxMpg);

divSliderMpg
    .style({
      width: width + "px",
      "margin-left": margin.left + "px",
      "margin-bottom": 45 + "px"
    });

d3.select('#mpgSlider').call(sliderCallMpg);

function slideMpg(event, val){

  d3.select(".front.bar")
    // .attr("y", height - y(xMpg(val)))
    .attr("height", y(xMpg(val)));

}

var divSliderGpm = d3.select("body").append("div").attr("id","gpmSlider");

var sliderCallGpm = d3.slider().on("slide", slideGpm).axis( d3.svg.axis().orient("top").ticks(4) ).max(mYear/mpg/100).min(mYear/maxMpg/100).step(.1).value(mYear/mpg/100);

divSliderGpm
    .style({
      width: width + "px",
      "margin-left": margin.left + "px"
    });

d3.select('#gpmSlider').call(sliderCallGpm);

function slideGpm(event, val){

  d3.select(".front.bar")
    // .attr("y", height - y(val*100))
    .attr("height", y(val*100));

}