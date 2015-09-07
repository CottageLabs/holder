// a force directed network graph visualisation

// calculates nodes and links from an ES response set with hits and aggregations
var setnodesandlinks = function(data) {
    var visdata = {nodes:[],links:[]}; //,linksindex:{}};
    for ( var i in data.hits.hits ) {
        var rec = data.hits.hits[i]._source !== undefined ? data.hits.hits[i]._source : data.hits.hits[i].fields;
        rec === undefined ? rec = {} : rec = {bibjson:rec.bibjson};
        var nrec = {};
        nrec.key = rec.bibjson.title;
        nrec.value = 1;
        nrec.field = 'records';
        for ( var an in data.aggregations ) {
            var dta = dot(rec,an.replace('.exact',''));
            if ( dta ) {
                nrec[an] = dta;
            }
        }
        visdata.nodes.push(nrec);
    };
    for ( var i in data.aggregations ) {
        var arrs = data.aggregations[i].buckets;
        for ( var bi in arrs ) {
            var arr = arrs[bi];
            arr.field = i;
            arr.value = arr.doc_count;
            visdata.nodes.push(arr);
            for ( var x = 0; x < data.hits.hits.length; x++ ) {
                if ( visdata.nodes[x][i] === arr.key || ( visdata.nodes[x][i] !== undefined && visdata.nodes[x][i].indexOf(arr.key) !== -1 ) ) {
                    visdata.links.push({"source":visdata.nodes.length-1,"target":x});
                }
            };
        }
    }
    return visdata;
}

// the fill colour of vis dots determined by passing in the field name
var fill = d3.scale.category10();

// the label function for vis dots determined by the preferred key and the count
var label = function(d) {
    // calculate a label
    var label = '';
    if ( d.key ) label += d.key;
    if ( d.doc_count ) { d.doc_count > 1 ? label += ' (' + d.doc_count + ') ' : false; }
    if (!label) label = "unknown"
    return label;
}

var filter = function(d) {
    var fq = {term:{}};
    fq.term[d.field] = d.key;
    $('body').holder.options.query.query.filtered.filter.bool.must.push(fq);
    $('body').holder.options.execute();
}

// the actual force directed graph function
var network = function(data) {
    // prep the vis target area
    $('.holder.holder-vis').html("");
    var w = $('.holder.holder-vis').width();
    var h = $('.holder.holder-vis').height();
    var vis = d3.select(".holder.holder-vis").append("svg:svg").attr("width", w).attr("height", h).attr("pointer-events", "all").append('svg:g').call(d3.behavior.zoom().on("zoom", redraw)).append('svg:g');
    vis.append('svg:rect').attr('width', w).attr('height', h).attr('fill', 'transparent');

    // redraw on zoom
    function redraw() {
        vis.attr("transform",
            "translate(" + d3.event.translate + ")"
            + " scale(" + d3.event.scale + ")"
        );
    }

    // start the force layout
    var visdata = setnodesandlinks(data);
    var force = d3.layout.force().charge(-200).linkDistance(100).nodes(visdata.nodes).links(visdata.links).size([w, h]).start();

    // put links on it
    var link = vis.selectAll("line.link").data(visdata.links).enter().append("svg:line").attr("class", "link").attr("stroke", "#999").attr("stroke-opacity", 0.8).attr("x1", function(d) { return d.source.x; }).attr("y1", function(d) { return d.source.y; }).attr("x2", function(d) { return d.target.x; }).attr("y2", function(d) { return d.target.y; });

    // put the nodes on it
    var dom = d3.extent(visdata.nodes, function(d) {
        return d.value;
    });
    var cr = d3.scale.sqrt().range([5, 25]).domain(dom);
    var node = vis.selectAll("circle.node")
        .data(visdata.nodes)
        .enter().append("svg:circle")
        .attr("class", "node")
        .attr("name", function(d) { return label(d); })
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("r", function(d) { return cr(d.value); })
        .style("fill", function(d) { return fill(d.field); })
        .call(force.drag)
        .on("click", function(d) { filter(d); });
        //.on("mouseover", highlight(.1)) - could add functions here to highlight result answer
        //.on("mouseout", highlight(1));

    // put a hover a label and a click pointer on
    node.append("svg:title")
        .text(function(d) { return label(d); });
    $('.node').css({"cursor":"pointer"});

    // define the changes that happen when the diagram ticks over
    force.on("tick", function() {
        link.attr("x1", function(d) { return d.source.x; }).attr("y1", function(d) { return d.source.y; }).attr("x2", function(d) { return d.target.x; }).attr("y2", function(d) { return d.target.y; });
        node.attr("cx", function(d) { return d.x; }).attr("cy", function(d) { return d.y; });

    });

};
