// makes a nice chart of data from aggregations or results


// receive the raw data from the elasticsearch response and create a results set for the chart from it
// could pass back results, all (including aggregations), aggregations, or a specific named aggregation
var dataset = function(data,tp) {
    var res = [];
    if ( tp === 'results' || tp === 'all' ) {
        for ( var i in data.hits.hits ) {
            var rec = data.hits.hits[i]._source !== undefined ? data.hits.hits[i]._source : data.hits.hits[i].fields;
            res.push(rec); // TODO actually need to know how to set type, term, and value if not already set
        }
    }
    for ( var i in data.aggregations ) {
        if ( tp === i || tp === 'all' || tp === 'aggregations' || tp.indexOf(i) !== -1 ) {
            var arrs = data.aggregations[i].buckets;
            for ( var bi in arrs ) {
                res.push({type:i,term:arrs[bi].key,value:arrs[bi].doc_count}); // TODO is any other info useful here? key name for display? etc
            }
        }
    }
    // this just does as above but for facets for results from old ES
    for ( var i in data.facets ) {
        if ( tp === i || tp === 'all' || tp === 'facets' || tp === 'aggregations' || tp.indexOf(i) !== -1 ) {
            var arrs = data.facets[i].terms;
            for ( var bi in arrs ) {
                res.push({type:i,term:arrs[bi].term,value:arrs[bi].count}); // TODO is any other info useful here? key name for display? etc
            }
        }
    }
    return res;
};

var chart = function(respdata,agg) {
    var fill = d3.scale.category20c();
    $('.holder.holder-chart').html("");
    var data = dataset(respdata,agg);
    var w = $('.holder.holder-chart').width();
    var h = $('.holder.holder-chart').height();
    var barh = 20;
    console.log(w)
    console.log(h)
    console.log(data)
    var x = d3.scale.linear().domain([0,d3.max(data,function(d) {return d.value; })]).range([0,w]);
    var chart = d3.select('.holder.holder-chart').attr('width',w).attr('height',barh*data.length);
    var bar = chart.selectAll("g").data(data).enter().append("g").attr("transform", function(d,i) {return "translate(0," + i * barh + ")"; });
    bar.append("rect").attr("width",function(d) { return x(d.value); }).attr("height",barh-1).style("fill", function(d) { return fill(d.type); });
    bar.append("text").attr("x",function(d) {return x(d.value) - 3; }).attr("y",barh/2).attr("dy",".35em").text(function(d) {return d.type + ' ' + d.term + ' ' + d.value; });

};
