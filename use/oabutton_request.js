
$.fn.holder.use.oabutton = {
  url: "https://api.openaccessbutton.org/requests",
  pushstate: false,
  //scroll:true,
  datatype: 'JSON',
  size:1000,
  sort:[{createdAt:'desc'}],
  fields: ['_id','type','status','url','created_date','title','email','user.username','user.affiliation','user.profession','location.geo.lat','location.geo.lon','story'],
  /*facets: {
    status: { terms: { field: "status.exact" } },
    type: { terms: { field: "type.exact" } },
    plugin: { terms: { field: "plugin.exact", size: 100 } },
    "user email": { terms: { "field": "user.email.exact", size: 1000 } },
    "author email": { terms: { field: "email.exact", size: 1000 } },
    keyword: { terms: { field: "keywords.exact", size: 1000 } },
    journal: { terms: { field: "journal.exact", size: 1000 } }
  }*/
  
  record: function(rec,idx) {
    var sts = {
      moderate: {text:'Awaiting moderation - nearly ready :)',color:'#ddd',highlight:'grey'},
      help: {text:'We need more info - can you help?',color:'#ddd',highlight:'#f04717'},
      progress: {text:'In progress - read more, support it, provide it!',highlight:'#212f3f'},
      received: {text:'Success! This item is available!',highlight:'#5cb85c',color:'#dcefdc'},
      refused: {text:'Refused - can you help us try again?',highlight:'#d9534f',color:'#f1c2c0'}
    }
    var color = rec.status && sts[rec.status] && sts[rec.status].color ? sts[rec.status].color : '#eee';
    var status = rec.status && sts[rec.status] && sts[rec.status].text ? sts[rec.status].text : rec.status;
    var highlight = rec.status && sts[rec.status] && sts[rec.status].highlight ? sts[rec.status].highlight : '#eee';
    var text = rec.status && sts[rec.status] && sts[rec.status].highlight ? sts[rec.status].highlight : 'blue';
    var re = '<div class="well" style="border-width:3px;border-color:' + highlight + ';margin:30px auto 0px auto;background-color:' + color + '">';
    re += '<p><b><a href="/request/' + rec._id + '">' + rec.title + '</a></b></p>';
    re += '<blockquote>';
    re += rec.story + '<cite>';
    re += rec['user.username'] + ', ' + rec['user.profession'] + '. ' + rec['user.affiliation'] + '<br>';
    re += '<a href="/request/' + rec._id + '" style="color:' + text + ';">' + status + '</a></cite>';
    re += '</blockquote></div>';
    return re;
  },
  transform: function() {},
  review: function(data) {
    var options = $(this).holder.options;
    if (data === undefined) data = options.response;
    var fromclass='.from' + options.query.from;
    if (options.paging) {
      $('.' + options.class + '.results').last().after('<div class="' + options.class + ' additional results ' + fromclass.replace('.','') + '"></div>');
      if (!options.scroll) $('div.' + options.class + '.results').not(fromclass).hide();
    } else {
      options.records = [];
      $('div.' + options.class + '.additional.results').remove();
      $('div.' + options.class + '.results').show().html('');
    }
    var results = data.hits.hits;
    for ( var r in results ) {
      var rec = results[r];
      if (rec.fields) rec = rec.fields;
      if (rec._source) rec = rec._source;
      options.records.push(rec);
      if (typeof options.record === 'function') {
        $('.' + options.class + '.results'+fromclass).append(options.record(rec,r));
      }
    }
    $('.requestcount').html(options.response.hits.total);
  },
  
  instruct: function(e) {
    if (e) e.preventDefault();
    var options = $(this).holder.options;
    var which = $(e.target).attr('val');
    $('.instruct').hide();
    $('.instruct.'+which).show();
  }

};

