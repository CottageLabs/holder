
$.fn.holder.use.oabutton = {
  url: "https://api.openaccessbutton.org/query",
  pushstate: false,
  sticky:true,
  datatype: 'JSON',
  record:false,
  size:200,
  fields: ['type','status','plugin','url','createdAt','title','doi','user.email','user.affiliation','user.profession','keywords','email','journal','issn','publisher']//,
  /*facets: {
    status: { terms: { field: "status.exact" } },
    type: { terms: { field: "type.exact" } },
    plugin: { terms: { field: "plugin.exact", size: 100 } },
    "user email": { terms: { "field": "user.email.exact", size: 1000 } },
    "author email": { terms: { field: "email.exact", size: 1000 } },
    keyword: { terms: { field: "keywords.exact", size: 1000 } },
    journal: { terms: { field: "journal.exact", size: 1000 } }
  }*/
};

