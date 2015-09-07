
var world = function() {
    
    var width = 960,
        height = 1160;

    var projection = d3.geo.mercator()
        .translate([(width/2), (height/2)])
        .scale( width / 2 / Math.PI)         
        .center([0, 30 ]); 

    var path = d3.geo.path()
        .projection(projection);

    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

    d3.json("lib/maps/world-topo.json", function(error, world) {
      var countries = topojson.feature(world, world.objects.countries);

      svg.selectAll(".subunit")
          .data(countries.features)
        .enter().append("path")
          .attr("class", function(d) { return "subunit " + d.id; })
          .style("fill", function(d) { return d.properties.color; })
          .attr("d", path);

      /*svg.append("path")
          .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
          .attr("d", path)
          .attr("class", "subunit-boundary");*/


      svg.selectAll(".subunit-label")
          .data(countries.features)
        .enter().append("text")
          .attr("class", function(d) { return "subunit-label " + d.id; })
          .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
          .attr("dy", ".35em")
          .text(function(d) { return d.properties.name; });

    });
};

/*
var world = function(target,countrycolor,pointcolor) {
    mapresponse = undefined;     
    var updatemap = function(data) {         
        mapresponse = data;         
        $('.point').remove();         
        draw(topo);     
    }      
    var defaultmapquery = {"query": {"match_all": {} } }         
    var mapquery = function(qry) {         
        // get the query from the search query but change the size to max and specify required fields         
        qry.size = 100000,         
        qry.fields = [             
            "coords.lat",             
            "coords.lng"        
        ]         
        qry.facets = {};         
        $.ajax({             
            type: 'GET',             
            url: '/query/?source=' + JSON.stringify(qry),             
            dataType: 'JSONP',             
            success: updatemap         
        });     
    }     
    //mapquery(defaultmapquery);          
    
    d3.select(window).on("resize", throttle);              
    var width = document.getElementById(target).offsetWidth;     
    var height = width/2;          
    var topo,projection,path,svg,g;          
    var tooltip = d3.select("#" + target).append("div").attr("class", "tooltip hidden");          
    setup(width,height);          
    
    function setup(width,height) {       
        projection = d3.geo.mercator()
        .translate([(width/2), (height/2)])         
        .scale( width / 2 / Math.PI)         
        .center([0, 30 ]); 

        //projection.rotate([10,-15,0]);            
        path = d3.geo.path().projection(projection);            
        
        svg = d3.select("#" + target).append("svg")           
        .attr("width", width)           
        .attr("height", height)           
        .append("g");            
        
        g = svg.append("g");              
    }          
    
    d3.json("http://static.cottagelabs.com/maps/world-topo.json", function(error, world) {            
        var countries = topojson.feature(world, world.objects.countries).features;            
        topo = countries;       
        draw(topo);          
    });          
    
    function draw(topo) {            
        var country = g.selectAll(".country").data(topo);            
        
        country.enter().insert("path")           
        .attr("class", "country")           
        .attr("d", path)           
        .attr("id", function(d,i) { return d.id; })           
        .attr("title", function(d,i) { return d.properties.name; })           
        .style("fill", countrycolor);            
        
        //add points and repo suggestions       
        /*if ( mapresponse ) {           
            mapresponse.hits.hits.forEach(function(i){               
                addpoint(                 
                    i.fields["coords.lng"],                 
                    i.fields["coords.lat"]               
                );           
            });       
        }*/
    /*}               
    
    function redraw() {       
        width = document.getElementById(target).offsetWidth;       
        height = width/2;       
        d3.select('svg').remove();       
        setup(width,height);       
        draw(topo);     
    }                         
    
    var throttleTimer;     
    function throttle() {       
        window.clearTimeout(throttleTimer);         
        throttleTimer = window.setTimeout(function() {           
            redraw();         
        }, 200);     
    }       
    
    //function to add points and text to the map (used in plotting capitals)     
    function addpoint(lat,lon) {            
        var gpoint = g.append("g").attr("class", "gpoint");       
        var x = projection([lat,lon])[0];       
        var y = projection([lat,lon])[1];            
        
        gpoint.append("svg:circle")             
        .attr("cx", x)             
        .attr("cy", y)             
        .attr("class","point")             
        .attr("r", 1)             
        .style("fill", pointcolor);          
        
    }   


}*/