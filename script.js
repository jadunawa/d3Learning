/* global window */
(function(window) { "use strict";
	var d3 = window.d3;
	var data = window.expgraph_data.data;
	var promin = -1;
	var promax = -1;
	var regmin = -1;
	var regmax = -1;
	for (var i = 0; i < data.length; i++) {
		var day_reg = parseInt(data[i][0]);
		var day_pro = parseInt(data[i][1]);
		if (promin == -1 || day_pro < promin) {
			promin = day_pro;
		}
		if (promin == -1 || day_pro > promax) {
			promax = day_pro;
		}
		if (regmin == -1 || day_reg < regmin) {
			regmin = day_reg;
		}
		if (regmax == -1 || day_reg > regmax) {
			regmax = day_reg;
		}
	}

	var yearmin = parseInt(data[0][4]);
	var yearmax = parseInt(data[data.length - 1][4]);
	var monthmin = parseInt(data[0][2]);
	var monthmax = parseInt(data[data.length - 1][2]);
	var daymin = parseInt(data[0][3]);
	var daymax = parseInt(data[data.length - 1][3]);

	// define dimensions of graph
	var m = [0, 80, 80, 80]; // margins
	var w = 1000 - m[1] - m[3]; // width
	var h = 450 - m[0] - m[2]; // height

	// X scale will fit all values from data within pixels 0-w
	var minDate = new Date(yearmin, monthmin - 1, daymin),
		maxDate = new Date(yearmax, monthmax - 1, daymax);
	var x = d3.time.scale()
		.domain([minDate, maxDate])
		.range([0, w]);

	// Y scale will fit values from 0-10 within pixels h-0 (Note the inverted domain for the y-scale: bigger is up!)
	var diff = regmax - regmin;
	var diff2 = promax - promin;
	var y1;
	if (diff < 10) {
		y1 = d3.scale.linear()
			.domain([regmin - 0.1 * diff, regmax + 0.1 * diff])
			.range([h, 0]);
	} else {
		y1 = d3.scale.linear()
			.domain([regmin - 10, regmax + 10])
			.range([h, 0]);
	}
	var y2;
	if (diff2 < 10) {
		y2 = d3.scale.linear()
			.domain([promin - 10, promax + 10])
			.range([h, 0]);
	} else {
		y2 = d3.scale.linear()
			.domain([promin - 0.1 * diff2, promax + 0.1 * diff2])
			.range([h, 0]);
	}

	// create a line function that can convert data[] into x and y points
	var line1 = d3.svg.line()
		// assign the X function to plot our line as we wish
		.x(function(d) {
			var tempDate = new Date(parseInt(d[4]), parseInt(d[2]) - 1, parseInt(d[3]));
			return x(tempDate);
		})
		.y(function(d) {
			return y1(parseInt(d[0]));
		})
		.interpolate("basis");

	// Add an SVG element with the desired dimensions and margin.
	var graph = d3.select("#expressions-graph .graph-1").append("svg:svg")
		//.attr("width", w + m[1] + m[3])
		//.attr("height", h + m[0] + m[2])
		.attr("viewBox", "0 0 " + (w + m[1] + m[3]) + " " + (h + m[0] + m[2]))
		.append("svg:g")
		.attr("transform", "translate(" + m[3] + "," + m[0] + ")");

	// create yAxis
	var xAxis = d3.svg.axis().scale(x).tickSize(-h).tickSubdivide(true);
	// Add the x-axis.
	graph.append("svg:g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + (h + 10) + ")")
		.text("Date")
		.call(xAxis);

	// create left yAxis
	var yAxis1 = d3.svg.axis().scale(y1).ticks(4).orient("left");
	// Add the y-axis to the left
	graph.append("svg:g")
		.attr("class", "y axis axis1")
		.attr("transform", "translate(-15,0)")
		//attr("transform", "translate("+(w/2)+",0)")
		.call(yAxis1);

	// add lines
	// do this AFTER the axes above so that the line is above the tick-lines
	graph.append("svg:path")
		.attr("d", line1(data))
		.attr("class", "data1");

	//------------------------------------------------------------
	// create a line function that can convert data[] into x and y points
	var line2 = d3.svg.line()
		// assign the X function to plot our line as we wish
		.x(function(d) {
			var tempDate = new Date(parseInt(d[4]), parseInt(d[2]) - 1, parseInt(d[3]));
			return x(tempDate);
		})
		.y(function(d) {
			return y2(parseInt(d[1]));
		})
		.interpolate("basis");

	var graph2 = d3.select("#expressions-graph .graph-2").append("svg:svg")
		//.attr("width", w + m[1] + m[3])
		//.attr("height", h + m[0] + m[2])
		.attr("viewBox", "0 0 " + (w + m[1] + m[3]) + " " + (h + m[0] + m[2]))
		.append("svg:g")
		.attr("transform", "translate(" + m[3] + "," + m[0] + ")");

	graph2.append("svg:g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + (h + 10) + ")")
		.text("Date")
		.call(xAxis);

	// create yAxis
	var yAxis2 = d3.svg.axis().scale(y2).ticks(6).orient("left");
	// Add the y-axis to the right
	graph2.append("svg:g")
		.attr("class", "y axis axis2")
		.attr("transform", "translate(-15,0)")
		//.attr("transform", "translate(" + (w/2) + ",0)")
		.call(yAxis2);

	graph2.append("svg:path")
		.attr("d", line2(data))
		.attr("class", "data2");

	//--------------------------------------------------------------------------------------------------------------------------------
	// create a horizontal bar graph
	var data2=[1,25,7,333,50,4,37,78,19];

	var x=d3.scale.linear()
		.domain([0,d3.max(data2)])
		.range([0,d3.max(data2)*10]);

	var hBarGraph=d3.select(".horizontal-bar")
		.selectAll("div")
			.data(data2)
		.enter().append("div")
	    	.style("width", function(d) { return ((d/d3.max(data2))*document.getElementById("bar-graph").offsetWidth*0.9) + "px"; })
	    	.append("span")
	    		.text(function(d) { return d; });

	//--------------------------------------------------------------------------------------------------------------------------------
	// create a vertical bar graph
	// uses hello2 set

	var hello2={states:["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware",
						"Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky",
						"Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi",
						"Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico",
						"New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania",
						"Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont",
						"Virginia","Washington","West Virginia","Wisconsin","Wyoming"],
				values:[0.75,0.36,0.21,0.55,0.58,0.78,0.39,0.99,0.90,0.63,0.43,0.34,0.12,0.70,0.39,0.13,0.87,
						0.82,0.03,0.05,0.93,0.59,0.51,0.52,0.44,0.73,0.22,0.23,0.29,0.31,0.37,0.70,0.37,0.01,
						0.07,0.13,0.16,0.69,0.96,0.74,0.74,0.73,1.00,0.50,0.50,0.60,0.30,0.40,0.80,0.76]};

	//console.log(hello2.states);

	var stateData=[];

	for(var i=0;i<hello2.states.length; i++){
		stateData.push({
			state:hello2.states[i],
			value:hello2.values[i]
		});
	}

	//console.log(stateData);

	var margin={top:20, right:20, bottom:15, left:50},
		width=d3.select(".vertical-bar")[0][0].offsetWidth*0.9-margin.top-margin.right,
		height=370-margin.top-margin.bottom;

	var x=d3.scale.ordinal()
		.rangeRoundBands([0,width],0.1);
	var y=d3.scale.linear()
		.range([height,0]);

	var xAxis=d3.svg.axis()
		.scale(x)
		.orient("bottom");

	var yAxis=d3.svg.axis()
		.scale(y)
		.orient("left")
		.ticks(10, "%");

	var svg=d3.select(".vertical-bar").append("svg")
		.attr("width",width+margin.left+margin.right)
		.attr("height",height+margin.top+margin.bottom)
		.append("g")
			.attr("transform","translate("+margin.left+","+margin.top+")")
			.call(xAxis)
			.call(yAxis);

	svg.selectAll(".bar")
		.data(stateData)
		.enter().append("rect")
			.attr("class","bar")
			.attr("x",function(d,i){ return width/stateData.length*i;})
			.attr("width",width/stateData.length-5)
			.attr("y",function(d){ return height-d.value * height;})
			.attr("height",function(d){ return d.value * height;});

	//--------------------------------------------------------------------------------------------------------------------------------
	// create a horizontal histogram
	// uses data2 set

	var x=d3.scale.linear()
		.domain([0,d3.max(data2)])
		.range([0,d3.max(data2)*10]);

	var barGraph=d3.select(".histogram-graph")
		.selectAll("div")
			.data(data2)
		.enter().append("div")
	    	.style("width", function(d) { return d/d3.max(data2)*90 + "%"; })
	    	.text(function(d) { return d; });


	//--------------------------------------------------------------------------------------------------------------------------------
	// create a map zoomable choropleth
	// uses mapset set

	var hello2={states:["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware",
						"Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky",
						"Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi",
						"Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico",
						"New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania",
						"Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont",
						"Virginia","Washington","West Virginia","Wisconsin","Wyoming"],
				ids:[1,2,4,5,6,8,9,10,12,13,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,
						37,38,39,40,41,42,44,45,46,47,48,49,50,51,53,54,55,56],
				values:[0.75,0.36,0.21,0.55,0.58,0.78,0.39,0.99,0.90,0.63,0.43,0.34,0.12,0.70,0.39,0.13,0.87,
						0.82,0.03,0.05,0.93,0.59,0.51,0.52,0.44,0.73,0.22,0.23,0.29,0.31,0.37,0.70,0.37,0.01,
						0.07,0.13,0.16,0.69,0.96,0.74,0.74,0.73,1.00,0.50,0.50,0.60,0.30,0.40,0.80,0.76]};

	var color=d3.scale.threshold()
		.domain([0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1.01])
		.range(["#FFB76F","#FFA64E","#FF9934","#FF8B1A","#FF7F00","#DC7F22","#E57100","#CC6601","#B35901","#994B00"]);

	var width=d3.select(".vertical-bar")[0][0].offsetWidth,
		height = 450,
		centered,
		active=d3.select(null);

	var projection =d3.geo.albersUsa()
		.scale(width*1.3)
		.translate([width/2+width*0.01, height/2]);

	var path=d3.geo.path()
		.projection(projection);

	var svg=d3.select(".map-graph").append("svg")
		.attr("width",width)
		.attr("height",height);

	svg.append("rect")
		.attr("class","map-background")
		.attr("width",width)
		.attr("height",height)
		.on("click",reset);

	var g=svg.append("g");

	d3.json(expgraph_data.plugin_url+"us.json", function(error, us){
		if(error) throw error;

		//console.log(us);

		g.append("g")
			.attr("id","states")
			.selectAll("path")
				.data(topojson.feature(us, us.objects.states).features)
			.enter().append("path")
				.attr("d",path)
				.style("fill",function(d){
					var index=hello2.ids.indexOf(d.id);
					var cVal=hello2.values[index];
					//console.log(d);
					//console.log("|->index: ",index," | cVal: ",cVal);
					return color(cVal);
				})
				.attr("data-id", function(d){ return d.id;})
				.on("click",clicked);

		g.append("path")
			.datum(topojson.mesh(us, us.objects.states, function (a, b) { return a!==b;}))
			.attr("id", "state-borders")
			.attr("d", path);
	});

	//zoom
	//todo: show actual specific number
	function clicked(d){

		//zoom to bounding box
		if (active.node() === this) return reset();
		  active.classed("active", false);
		  active = d3.select(this).classed("active", true);

		  var bounds = path.bounds(d),
		      dx = bounds[1][0] - bounds[0][0],
		      dy = bounds[1][1] - bounds[0][1],
		      x = (bounds[0][0] + bounds[1][0]) / 2,
		      y = (bounds[0][1] + bounds[1][1]) / 2,
		      scale = .9 / Math.max(dx / width, dy / height),
		      translate = [width / 2 - scale * x, height / 2 - scale * y];

		  g.transition()
		      .duration(750)
		      .style("stroke-width", 1.5 / scale + "px")
		      .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
	}

	function reset() {
	  active.classed("active", false);
	  active = d3.select(null);

	  g.transition()
	      .duration(750)
	      .style("stroke-width", "1.5px")
	      .attr("transform", "");
	}

	//--------------------------------------------------------------------------------------------------------------------------------
	// create a scatterplot
	// uses randomly generated data

	var margin = {top: 20, right: 20, bottom: 30, left: 40},
	    width = d3.select(".scatterplot")[0][0].offsetWidth - margin.left - margin.right,
	    height = 500 - margin.top - margin.bottom;

	var scatterData=[];

	var associativeScatterData=[];

	for(var i=0;i<50;i++){
		var firstRandom=100*Math.random();
		var secondRandom=50*Math.random();
		scatterData.push([firstRandom,secondRandom]);
	}

	for(var k=0;k<scatterData.length; k++){
		associativeScatterData.push({
			xPoint:scatterData[k][0],
			yPoint:scatterData[k][1]
		});
	}

	var x=d3.scale.linear()
		.domain([0,100])
		.range([0,width]);

	var y=d3.scale.linear()
		.domain([0,50])
		.range([height,0]);

	var xAxis=d3.svg.axis()
		.scale(x)
		.orient("bottom");

	var yAxis=d3.svg.axis()
		.scale(y)
		.orient("left");

	var svg=d3.select(".scatterplot").append("svg")
		.attr("width", width + margin.left + margin.right)
    	.attr("height", height + margin.top + margin.bottom)
    	.append("g")
    		.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    		.call(yAxis);
    var scatterGroup=svg.append("g")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

    var scatterDots=svg.selectAll("scatter-dots")
    	.data(scatterData)
    	.enter().append('g')
    		.attr('transform', function (d) { return 'translate(' + x(d[0]) + ','+(y(d[1])-5)+')'; })
			.on('mouseover', showCoords)
			.on('mouseout', removeRect);

	scatterDots.append("svg:circle")
		.attr("r",3);

		//trying to put x and y coordinates but it's not working :(
	scatterDots.append('text')
			.attr('transform', function (d) { return 'translate(0,-5)'; })
		    .attr('font-size', '0.5em')
		    .attr('text-anchor','middle')
		    .text(function (d) { return Math.round(d[0]); });

	var coordsShowing=0;

	function showCoords(d){
		//console.log(d);
		d.hovers=(d.hovers||0);
		if(d.hovers===0&&!d.hasToolTip){
			d.hasToolTip=true;
			console.log("this:");
			console.log(this);
			d3.select(this).append("rect")
				.attr("width",65)
				.attr("height",25)
				.attr("fill",'#E57100');
			d3.select(this).append("text")
				.attr("class","coord-tip")
				.attr("x",5)
				.attr("y",17)
				.text(function(d){ return "("+Math.round(d[0])+","+Math.round(d[1])+")"; });
		}
		d.hovers++;
	}

	function removeRect(d){
		var thatRect=this;
		d.hovers--;
		setTimeout(function(){
			if(d.hovers===0){
				console.log("Removing");
				d3.select(thatRect).select('rect').remove();
				d3.select(thatRect).select('.coord-tip').remove();
				d.hasToolTip=false;
			}
		},0);
	}

	//--------------------------------------------------------------------------------------------------------------------------------
	// create a pie chart
	// uses randomly generated data

	var pieData=[];
	var pieSize=Math.round(Math.random()*20+5);

	for(var i=0;i<pieSize;i++){
		pieData.push(Math.round(Math.random()*100+5));
	}

	console.log("pieData is: "+pieData);

	//var pieData = [10, 50, 80, 130, 150, 10, 100, 101];
	var a = d3.select(".pie-chart")[0][0].offsetWidth;
	var r = a/3;

	var pieColor = d3.scale.category20();
	    //.domain([0,"pivot", d3.max(data)])
	    //.range(['red', 'green', 'orange', 'blue', 'yellow']);

	var canvas = d3.select('.pie-chart').append('svg')
	    .attr('width', a)
	    .attr('height', a);

	var group = canvas.append('g')
	    .attr('transform', 'translate('+(a/2)+','+ (a/2) +')');

	var arc = d3.svg.arc()
	    .innerRadius(r-50)
	    .outerRadius(r);

	var pie = d3.layout.pie()
	    .value(function (d) { return d;});

	var arcs = group.selectAll('.arc')
	    .data(pie(pieData))
	    .enter()
	    .append('g')
	    .attr('class', 'arc');

	arcs.append('path')
	    .attr('d', arc)
	    .attr('stroke', 'black')
	    .attr('stroke-width', 2)
	    .attr('fill', function (d) { return pieColor(d.data); });

	arcs.append('text')
	    .attr('transform', function (d) { return 'translate(' + arc.centroid(d) + ')'; })
	    .attr('text-anchor', 'middle')
	    .attr('font-size', '0.8em')
	    .text(function (d) { return d.data; });

	//--------------------------------------------------------------------------------------------------------------------------------
	// TESTING WITH TUTORIALS
	// uses data from tutorials

	d3.selectAll('.testing')
		.data([1,2,3])
		.append('div')
		.text("hello");


	//--------------------------------------------------------------------------------------------------------------------------------
	// REDDIT COMMENT TESTING
	// uses data from tutorials

	var margin = {top: 40, right: 20, bottom: 30, left: 40},
	    width = 960 - margin.left - margin.right,
	    height = 500 - margin.top - margin.bottom;

	//var formatPercent = d3.format("0");

	var x=d3.scale.ordinal()
		.rangeRoundBands([0, width], 3);

	var y=d3.scale.linear()
		.range([height,0]);

	var xAxis=d3.svg.axis()
		.scale(x)
		.orient("bottom");

	var yAxis=d3.svg.axis()
		.scale(y)
		.orient("left");
		//.tickFormat(formatPercent);

	var tip=d3.tip()
		.attr('class','d3-tip')
		.offset([-10,0])
		.html(function(d) { return "<strong>Frequency:</strong> <span style='color:red'>" + d.total_score + "</span>";});

	var svg=d3.select("reddit-comments-graph").append("svg")
		.attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
		.append("g")
	    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	svg.call(tip);

	d3.tsv("reddit-data.tsv", type, function(error, data){
		x.domain(data.map(function(d){ return d.user;}));
		y.domain([0,d3.max(data, function(d){ return d.total_score})]);

		svg.append("g")
			.attr("class","x axis")
			.attr("transform", "translate(0," + height + ")")
      		.call(xAxis);

      	svg.append("g")
      		.attr("class", "y axis")
      		.call(yAxis);

      	svg.selectAll("bar")
      		.data(data)
      		.enter().append("rect")
      			.attr("class", "bar")
      			.attr("x", function(d){ return x(d.user);})
				.attr("width", x.rangeBand())
				.attr("y",function(d){return y(d.total_score);})
				.attr("height",function(d){return height-y(d.total_score);})
				.on('mouseover', tip.show)
				.on('mouseout', tip.hide)
	});

	function type(d){
		d.total_score=+d.total_score;
		return d;
	}



})(window);