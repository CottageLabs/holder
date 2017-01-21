
// this graph display assumes the default search display has already tidily created options.results

$.fn.holder.display.graph = function(obj) {
  var options = obj.holder.options;
  
	var chartit = function(e) {
		$('svg.' + options.class + '.graph').html("");
		var data = [];
		data.columns = [];
		var counts = {};
		var graphwhat = $('.'+options.class+'.graphcontrol.graphwhat').val();
		var graphgroup = $('.'+options.class+'.graphcontrol.graphgroup').val();
		// TODO do something about when things are lists
		// also do something about when there are too many options and too many checkboxes get created
		for ( var d in options.records ) {
			var dd = options.records[d];
			if ( ( !$('.'+options.class+'.graphgroups[group="'+dd[graphgroup]+'"]').length || $('.'+options.class+'.graphgroups[group="'+dd[graphgroup]+'"]').is(':checked') ) && dd[graphwhat] ) {
				if ( !dd[graphgroup] ) dd[graphgroup] = 'UNKNOWN';
				if (counts[dd[graphgroup]] === undefined) {
					counts[dd[graphgroup]] = {};
					counts[dd[graphgroup]][graphgroup] = dd[graphgroup];
				}
				if (counts[dd[graphgroup]][dd[graphwhat]] === undefined) counts[dd[graphgroup]][dd[graphwhat]] = 0;
				counts[dd[graphgroup]][dd[graphwhat]] += 1;
				if (data.columns.indexOf(dd[graphwhat]) === -1 && dd[graphwhat] !== 'UNKNOWN') data.columns.push(dd[graphwhat]);
			}
		}
		for ( var c in counts ) data.push(counts[c]);
		if (!e || $(this).hasClass('graphcontrol')) {
			$('.'+options.class+'.graphgroupscheckbox').remove();
			for ( var k in counts ) {
				// TODO fix this, using the values as the ID results in invalid IDs
				$('.'+options.class+'.graphcontrols').append('<span class="' + options.class + ' graphgroupscheckbox"> ' + k + ' <input type="checkbox" checked="checked" class="' + options.class + ' graphgroups" group="' + k + '"> </span>');
			}
			$('input.'+options.class+'.graphgroups').bind('change',chartit);
		}
    chart(data,graphgroup);
	}  

	// on paging, introduce new data or redraw?
	
  /*if ( $('svg.'+options.class+'.graph').length ) {
		// good to go
	} else if ( $('div.'+options.class+'.graph').length ) {
		$('.'+options.class+'.graph').append('<svg class="' + options.class + ' graph" style="width:100%;height:100%;"></svg>');
	} else {
		obj.append('<svg class="' + options.class + ' graph" style="width:100%;height:100%;"></svg>');
	}*/

  if ( !$('div.'+options.class+'.graph').length ) {
		obj.append('<div class="' + options.class + ' graph" style="outline:1px solid #ccc;margin-top:20px;height:800px;padding-left:5px;padding-right:5px;"></div>');
		$('div.'+options.class+'.graph').append('\
			<div class="' + options.class +  ' graphcontrols"> \
				<select class="form-control ' + options.class + ' graphcontrol graphwhat" style="width:200px;margin-top:5px;margin-bottom:5px;display:inline-block;"> \
				</select> \
				<select class="form-control ' + options.class + ' graphcontrol graphgroup" style="width:200px;margin-top:5px;margin-bottom:5px;display:inline-block;"> \
				</select> \
			</div> \
			<svg class="' + options.class + ' graph"></svg>'
		);
		var dh = $('div.'+options.class+'.graph').height() - ($('svg.'+options.class+'.graph').offset().top - $('svg.'+options.class+'.graph').parent().offset().top);
		var dw = $('div.'+options.class+'.graph').width();
		if ( !$('svg.'+options.class+'.graph').attr('height') ) $('svg.'+options.class+'.graph').attr('height',dh);
		if ( !$('svg.'+options.class+'.graph').attr('width') ) $('svg.'+options.class+'.graph').attr('width',dw);
		$('select.'+options.class+'.graphcontrol').on('change',chartit);
	}
	
	if (!options.paging) {
		// TODO this should probably build from an analysis of the keys in the records, not from options.fields
		// TODO what about a no-grouping option...
		for ( var f in options.fields ) {
			var whatselect = f === "0" ? ' selected="selected"' : '';
			var groupselect = options.fields.length === 1 || f === "1" ? ' selected="selected"' : '';
			$('.'+options.class+'.graphcontrol.graphwhat').append('<option value="' + options.fields[f] + '"' + whatselect + '>graph: ' + options.fields[f] + '</option>')
			$('.'+options.class+'.graphcontrol.graphgroup').append('<option value="' + options.fields[f] + '"' + groupselect + '>group by: ' + options.fields[f] + '</option>')
		}
	}

	// add <option value="classification">graph: classification</option> for each select above
	
  var chart = function(data,group) {

    var svg = d3.select("svg.holder.graph"),
      margin = {top: 100, right: 100, bottom: 30, left: 40},
      width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom,
      g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x0 = d3.scaleBand()
      .rangeRound([0, width])
      .paddingInner(0.1);

    var x1 = d3.scaleBand()
      .padding(0.05);

    var y = d3.scaleLinear()
      .rangeRound([height, 0]);

    var keys = data.columns;

    var z = keys.length < 10 ? d3.scaleOrdinal(d3.schemeCategory10) : d3.scaleOrdinal(d3.schemeCategory20c);

    x0.domain(data.map(function(d) { return d[group]; }));
    x1.domain(keys).rangeRound([0, x0.bandwidth()]);
    y.domain([0, d3.max(data, function(d) { return d3.max(keys, function(key) { return d[key]; }); })]).nice();

    g.append("g")
      .selectAll("g")
      .data(data)
      .enter().append("g")
        .attr("transform", function(d) { return "translate(" + x0(d[group]) + ",0)"; })
      .selectAll("rect")
      .data(function(d) { return keys.map(function(key) { var val = d[key] ? d[key] : 0; return {key: key, value: val}; }); })
      .enter().append("rect")
        .attr("x", function(d) { return x1(d.key); })
        .attr("y", function(d) { return y(d.value); })
        .attr("width", x1.bandwidth())
        .attr("height", function(d) { return height - y(d.value); })
        .attr("fill", function(d) { return z(d.key); })
      .append("title")
        .text(function(d) { return d.key + "\n" + d.value; });

    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x0));

    g.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y).ticks(10, "s"));

    var legend = g.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
      .selectAll("g")
      .data(keys.slice().reverse())
      .enter().append("g")
        .attr("transform", function(d, i) { return "translate(100," + (-100 + i * 20) + ")"; });

    legend.append("rect")
      .attr("x", width - 19)
      .attr("width", 19)
      .attr("height", 20)
      .attr("fill", z);

    legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(function(d) { return d; });
  }
		
	chartit();
  
}
