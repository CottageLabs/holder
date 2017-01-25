 
var _exportsuccess = function(data,format) {
  var filename = 'export.' + format;
  if (format === 'json') data = JSON.stringify(data,"",2);
  var blob = new Blob([data], { type: 'text/plain' });
  var fileReader = new FileReader(); 
  fileReader.onload = function(fl) {
    if (typeof window.navigator.msSaveBlob !== 'undefined') {
      window.navigator.msSaveBlob(blob, filename);
    } else {
      var a = document.createElement("a");
      if (typeof a.download === 'undefined') {
        window.location = fl.target.result;
      } else {
        a.href = fl.target.result;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
      }
    }
  };
  fileReader.readAsDataURL(blob);
}

$.fn.holder.use.export =  {
  export: function(e) {
    if (e) e.preventDefault();
    
    var format = $('button.btn.'+this.class+'.export.format.btn-info').attr('value');
    var what = $('button.btn.'+this.class+'.export.what.btn-info').attr('value');
    var records = this.records; 
    // records should depend on what, could be a page subset, or ALL (what to do if all, they won't all be present...)
    // if query is selected, will have to actually run the full query with max size, possibly multiple times... what is safe size?
    // what about wanting the total, even if it is huge?
    
    var opts = {
      url: 'https://dev.api.cottagelabs.com/convert?from=json&to=' + format,
      type: 'POST',
      cache: false,
      contentType: "application/json; charset=utf-8",
      dataType: 'JSON',
      data: JSON.stringify(records),
      success: function(data) { _exportsuccess(data,format); },
      error: function(data) { _exportsuccess(data.responseText,format); } // getting back csv causes error but still contains content
    };
    $.ajax(opts);
  }
}
