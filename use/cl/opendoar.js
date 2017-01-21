
$.fn.holder.use.opendoar = {
  url: "https://dev.api.cottagelabs.com/use/opendoar/search",
  datatype: 'JSON',
  pushstate: false,
  sticky:true,
  //scroll:true,
  extract:'data',
  display:false,
  defaultquery:{show:'max',q:[],from:0,size:10},
  
  placeholder: function() {
    var options = $(this).holder.options;
    var found = options.query.from + options.response.data.length + ' of ' + options.response.total;
    $('input.' + options.class + '.search').val("").attr('placeholder',found);
  },

  next: function(event) {
    if (event) event.preventDefault();
    var options = $(this).holder.options;
    if ( options.response && options.query.from + options.query.size < options.response.total) {
      options.query.from = options.query.from + options.query.size;
      if ( $('.' + options.class + '.results.from' + options.query.from).length !== 0 ) {
        $('div.' + options.class + '.results').not('.from'+options.query.from).hide();
        $('div.' + options.class + '.results.from' + options.query.from).show();
        options.placeholder();
      } else {
        options.paging = true;
        options.execute();
      }
    }
  },

  add: function(event,th) {
    if ( event ) event.preventDefault();
    if (!th) th = $(this);
    var options = th.holder.options;
    options.query.from = 0;
    var val = th.attr('val') ? th.attr('val') : th.val();
    if (th.val()) th.val("");
    if (val.length > 0) {
      options.query.q.push(val);
      options.execute();
    }
  },
  remove: function(event,th) {
    if (event) event.preventDefault();
    if (!th) th = $(this);
    var options = th.holder.options;
    var tgt = th.attr('val').replace('options.','');
    dotindex(options, tgt, undefined, true);
    th.remove();
    options.query.from = 0;
    options.execute();
  },
  
  qry: function() {
    var options = $(this).holder.options;
    if ( !options.query ) options.query = $.extend(true, {}, options.defaultquery);
    var tq = $.extend(true, {}, options.query);
    if (tq.q !== undefined) {
      if (tq.q.length === 0) {
        tq.q = 'all';
      } else {
        tq.q = tq.q.join('+');
      }
    } else {
      tq.q = 'all';
    }
    options.url = options.url.split('?')[0] + '?' + $.param(tq);
    return tq;    
  },
  
  render: function() {
    var options = $(this).holder.options;
    $('div.' + options.class + '.searches').html("");
    if ( $('div.' + options.class + '.options').length ) {
      $('div.' + options.class + '.options').remove(); // there are no options for this example yet
      $('a[toggle=".options"]').remove();
    }
    for ( var q in options.query.q ) {
      var btn = '<a style="margin:5px;" class="btn btn-default ' + options.class + '" do="remove" val="options.query.q.' + q + '"><b>X</b> ' + options.query.q[q] + '</a>';
      $('div.' + options.class + '.searches').append(btn);
    }
  }

};
