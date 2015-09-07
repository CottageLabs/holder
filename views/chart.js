// makes a nice chart of data from aggregations or results


// receive the raw data from the elasticsearch response and create a results set for the chart from it
// could pass back results, all (including aggregations), aggregations, or a specific named aggregation
var dataset = function(data,tp) {
    var res = [];
    if ( tp === 'results' || tp === 'all' ) {
        for ( var i in data.hits.hits ) {
            var rec = data.hits.hits[i]._source !== undefined ? data.hits.hits[i]._source : data.hits.hits[i].fields;
            rec === undefined ? rec = {} : rec = {bibjson:rec.bibjson}; // TODO this needs to be made generic
            res.push(rec);
        };
    }
    for ( var i in data.aggregations ) {
        if ( tp === i || tp === 'all' || tp === 'aggregations' ) {
            var arrs = data.aggregations[i].buckets;
            for ( var bi in arrs ) {
                res.push(arrs[bi].doc_count); // TODO is any other info useful here? key name for display? etc
            }
        }
    }
    // this just does as above but for facets for results from old ES
    for ( var i in data.facets ) {
        if ( tp === i || tp === 'all' || tp === 'aggregations' ) {
            var arrs = data.facets[i].terms;
            for ( var bi in arrs ) {
                res.push(arrs[bi].count); // TODO is any other info useful here? key name for display? etc
            }
        }
    }
    return res;
};

var chart = function(respdata,agg) {
    if (agg === undefined) agg = 'bibjson.author.name.exact'; // TODO this should not have to be set here, separate from doaj example
    $('.holder.holder-chart').html("");
    var data = dataset(respdata,agg);
    var w = $('.holder.holder-chart').width();
    var barh = 20;

    var x = d3.scale.linear().domain([0,d3.max(data)]).range([0,w]);
    var chart = d3.select('.holder.holder-chart').attr('width',w).attr('height', barh*data.length);
    var bar = chart.selectAll("g").data(data).enter().append("g").attr("transform", function(d,i) {return "translate(0," + i * barh + ")"; });
    bar.append("rect").attr("width",x).attr("height",barh-1).style("fill", function() { return fill(agg); });
    bar.append("text").attr("x",function(d) {return x(d) - 3; }).attr("y",barh/2).attr("dy",".35em").text(function(d) {return d; });

};
