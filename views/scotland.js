
var scotland = function(target,locations) {
    if (target === undefined) target = 'body';
    if (fill === undefined) var fill = d3.scale.category20();
        
    var w = $(target).width();
    var h = $(target).height();

    var projection = d3.geo.albers()
        .center([0.795, 55.89])
        .rotate([4.4, 0])
        .parallels([50, 60])
        .scale(15000)
        .translate([w / 1.6, h / 1.4]);

    var path = d3.geo.path()
        .projection(projection)
        .pointRadius(2);

    // redraw on zoom
    function redraw() {
        svg.attr("transform",
            "translate(" + d3.event.translate + ")"
            + " scale(" + d3.event.scale + ")"
        );
    }

    var svg = d3.select(target).append("svg:svg").attr("width", w).attr("height", h).attr("pointer-events", "all").append('svg:g'); //.call(d3.behavior.zoom().on("zoom", redraw)).append('svg:g');
    svg.append('svg:rect').attr('width', w).attr('height', h).attr('fill', 'transparent');

    d3.json("lib/maps/scotland/boundaries/all_councils_topo.json", function(error, scotland) {
      var subunits = topojson.feature(scotland, scotland.objects.layer1);

      svg.selectAll(".subunit")
          .data(subunits.features)
        .enter().append("path")
          .attr("class", function(d) { return "subunit " + d.id; })
          //.attr("fill", function(d) { return fill(d.id); })
          .attr("d", path);

      svg.append("path")
          .datum(topojson.mesh(scotland, scotland.objects.layer1, function(a, b) { return a !== b; }))
          .attr("d", path)
          .attr("class", "subunit-boundary");

      svg.selectAll(".subunit-label")
          .data(subunits.features)
        .enter().append("text")
          .attr("class", function(d) { return "subunit-label " + d.id; })
          .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
          .attr("dy", ".35em")
          .text(function(d) { return d.properties.gss; });



         var circles = svg.append("g")
            .attr("class", "circles")
            .selectAll("g")
            .data(locations)
            .enter().append("g")
            .attr("class", "circle");

         circles.append("circle")
            .attr("transform", function(d) {
                var location = projection([+d.lon, +d.lat]);
                return "translate(" + location[0]+ "," + location[1]+ ")";
            })
            .attr("r", function(d){
                return Math.sqrt(parseInt(d.count));
            })
         
          svg.selectAll(".circle-label")
              .data(locations)
            .enter().append("text")
              .attr("class", function(d) { return "circle-label " + d.name; })
              .attr("transform", function(d) {
                var location = projection([+d.lon, +d.lat]);
                return "translate(" + location[0]+ "," + location[1]+ ")";
              })
              .attr("dy", ".35em")
              .text(function(d) { return d.name + ' ' + d.count; });

        });

    /*
    d3.csv("lib/maps/scotland/schools.csv", function(error, schools) {
         var school = svg.append("g")
            .attr("class", "schools")
            .selectAll("g")
            .data(schools)
            .enter().append("g")
            .attr("class", "school");

         school.append("circle")
            .attr("transform", function(d) {
                var location = projection([+d.longitude, +d.latitude]);
                return "translate(" + location[0]+ "," + location[1]+ ")";
            })
            .attr("r", function(d){
                return Math.sqrt(parseInt(d.pupils)/1000);
            })
         
          svg.selectAll(".school-label")
              .data(schools)
            .enter().append("text")
              .attr("class", function(d) { return "school-label " + d.school_label; })
              .attr("transform", function(d) {
                var location = projection([+d.longitude, +d.latitude]);
                return "translate(" + location[0]+ "," + location[1]+ ")";
              })
              .attr("dy", ".35em")
              .text(function(d) { return d.school_label + ' ' + d.pupils; });

    });
    */

};