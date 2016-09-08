
var sankey = function(element,data,flows) {
  
  // this should be a function that is passed into holder somehow, and defines for a given key name how to process the data
  var _process = function(key,value) {
    if (key === "post_code") value = value.replace(/ /g,'').toUpperCase().substring(0,2);
    if (key === "progressions.institution_shortname") value = value[0];
    if (key === "progressions.reg_1st_year") value = value[0].length > 0 ? "1yes" : "1no";
    if (key === "progressions.reg_2nd_year") value = value[0].length > 0 ? "2yes" : "2no";
    return value;
  }
    
  // calculates nodes and links from an ES response set with hits and aggregations
  var setnodesandlinks = function(data) {
    var nodepositions = {};
    var nodecounts = {};
    var visdata = {nodes:[],links:[]}; //,linksindex:{}};
    for ( var i in data.hits.hits ) {
      var rec = data.hits.hits[i]._source !== undefined ? data.hits.hits[i]._source : data.hits.hits[i].fields;
      for ( var v in rec ) {
        var val = _process(v,rec[v]);
        if (val) {
          var vpos = undefined;
          if (nodepositions[v+val] === undefined) {
            visdata.nodes.push({name:val,type:v});
            vpos = visdata.nodes.length-1;
            nodepositions[v+val] = vpos;
          } else {
            vpos = nodepositions[v+val];
          }
          if (flows === undefined || flows[v] !== undefined) {
            for ( var vv in rec ) {
              if ( vv !== v ) {
                var vval = _process(vv,rec[vv]);
                if (vval) {
                  var vvpos = undefined;
                  if (nodepositions[vv+vval] === undefined) {
                    visdata.nodes.push({name:vval,type:vv});
                    vvpos = visdata.nodes.length-1;
                    nodepositions[vv+vval] = vvpos;
                  } else {
                    vvpos = nodepositions[vv+vval];
                  }
                  if ( flows === undefined || ( flows[v] !== undefined && flows[v].indexOf(vv) !== -1 ) ) {                 
                    var ref = [v,vv].sort()[0] === v ? vpos + '_' + vvpos : vvpos + '_' + vpos;
                    if (nodecounts[ref] === undefined) {
                      nodecounts[ref] = 1;
                    } else {
                      nodecounts[ref] += 1;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    for ( var nc in nodecounts ) {
      var parts = nc.split('_');
      visdata.links.push({source:parseInt(parts[0]),target:parseInt(parts[1]),value:nodecounts[nc]});
    }
    return visdata;
  }

  var visdata = setnodesandlinks(data);
  
  var margin = {top: 1, right: 1, bottom: 6, left: 1},
      width = 1200 - margin.left - margin.right,
      height = 950 - margin.top - margin.bottom;

  var formatNumber = d3.format(",.0f"),
      format = function(d) { return formatNumber(d); },
      color = d3.scale.category20();

  var svg = d3.select(element).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var sankey = d3.sankey()
      .nodeWidth(15)
      .nodePadding(10)
      .size([width, height]);

  var path = sankey.link();

  sankey
      .nodes(visdata.nodes)
      .links(visdata.links)
      .layout(32);

  var link = svg.append("g").selectAll(".link")
      .data(visdata.links)
    .enter().append("path")
      .attr("class", "link")
      .attr("d", path)
      .style("stroke-width", function(d) { return Math.max(1, d.dy); })
      .sort(function(a, b) { return b.dy - a.dy; });

  link.append("title")
      .text(function(d) { return d.source.type + ' ' + d.source.name + " → " + d.target.type + ' ' + d.target.name; });

  var node = svg.append("g").selectAll(".node")
      .data(visdata.nodes)
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
    .call(d3.behavior.drag()
      .origin(function(d) { return d; })
      .on("dragstart", function() { 
		  this.parentNode.appendChild(this); })
      .on("drag", dragmove));
  
  node.append("rect")
      .attr("height", function(d) { return d.dy; })
      .attr("width", sankey.nodeWidth())
      .style("fill", function(d) { return d.color = color(d.name.toLowerCase().replace(/[^a-z0-9]/, "")); })
      .style("stroke", function(d) { return d3.rgb(d.color).darker(2); })
    .append("title")
      .text(function(d) { return d.name + "\n" + format(d.value); });

  node.append("text")
      .attr("x", -6)
      .attr("y", function(d) { return d.dy / 2; })
      .attr("dy", ".35em")
      .attr("text-anchor", "end")
      .attr("transform", null)
      .text(function(d) { return d.name; })
    .filter(function(d) { return d.x < width / 2; })
      .attr("x", 6 + sankey.nodeWidth())
      .attr("text-anchor", "start");

  function dragmove(d) {
    d3.select(this).attr("transform", 
      "translate(" + (
        d.x = Math.max(0, Math.min(width - d.dx, d3.event.x))
      ) + "," + (
        d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))
      ) + ")");
    sankey.relayout();
    link.attr("d", path);
  }

}
