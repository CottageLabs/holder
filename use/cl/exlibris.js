

$.fn.holder.use.exlibris = {
  url: "https://dev.api.cottagelabs.com/use/exlibris/primo",
  datatype: 'JSON',
  pushstate: false,
  sticky:true,
  scroll:true,
  extract:'data',
  executeonload:false,
  display:false,
  defaultquery:{q:[],from:0,size:10},
  text: 'search Imperial exlibris. Start by providing a search term',
  
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
        tq.q = 'a';
      } else {
        tq.q = tq.q.join(',');
      }
    } else {
      tq.q = 'a';
    }
    options.url = options.url.split('?')[0] + '?' + $.param(tq);
    return tq;    
  },
  
  record: function(rec,idx) {
    var options = $(this).holder.options;
    var re = '<div style="word-wrap:break-word;padding:5px;margin-bottom:0px;';
    if (idx && parseInt(idx) && parseInt(idx)%2 !== 0) re += 'background-color:#eee;';
    re += '">';
    re += '<h3>' + rec.title + '</h3>';
    if (rec.library) {
      if ( rec.library instanceof Array ) rec.library = rec.library[0];
      if ( rec.library.status === 'available' ) {
        re += '<p style="font-weight:bold;color:red;">Available: ' + rec.library.collection + '</p>'
      }
    }
    if (rec.contributor) {
      if (typeof rec.contributor === 'string') rec.contributor = rec.contributor.split(';');
      for ( var c in rec.contributor ) {
        re += '<p>Contributor: ' + options.link({text:rec.contributor[c],val:'contributor:'+rec.contributor[c]}) + '</p>';
      }
    }
    if (rec.subject) {
      if (typeof rec.subject === 'string') rec.subject = [rec.subject];
      if (rec.subject.length !== 0) {
        re += '<p>Subject: ';
        var first = true;
        for ( var s in rec.subject ) {
          if (first) {
            first = false;
          } else {
            re += ', '
          }
          var sb = rec.subject[s].trim().replace('.','');
          re += options.link({text:sb,val:'subject:'+sb});
        }
        re += '</p>';
      }
    }
    re += '</div>';
    return re;
  },
  
  render: function() {
    var options = $(this).holder.options;
    $('div.' + options.class + '.searches').html("");
    for ( var q in options.query.q ) {
      var btn = '<a style="margin:5px;" class="btn btn-default ' + options.class + '" do="remove" val="options.query.q.' + q + '"><b>X</b> ' + options.query.q[q] + '</a>';
      $('div.' + options.class + '.searches').append(btn);
    }
  }

};
