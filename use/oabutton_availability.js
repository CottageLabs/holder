
$.fn.holder.use.oabutton = {
  url: "https://api.openaccessbutton.org/availabilities",
  pushstate: false,
  sticky:true,
  datatype: 'JSON',
  record:false,
  size:200,
  defaultquery: { 
    sort:[{createdAt:'desc'}],
    query: {
      filtered: {
        query: {
          bool: {
            must: [
            ]
          }
        },
        filter: {
          bool: {
            must:[]
          }
        }
      }
    }
  },
  fields:['url','plugin','username','createdAt','discovered.article']
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

