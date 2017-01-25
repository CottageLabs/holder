
$.fn.holder.display.export = function(obj) {
  var options = obj.holder.options;
  
  if ( !$('.'+options.class+'.export').length ) {
    if ( $('.'+options.class+'.options').length ) {
      $('.'+options.class+'.options').append('<div class="' + options.class + ' display export"></div>');
    } else {
     obj.append('<div class="' + options.class + ' display export"></div>');
    }
  }
    
  $('.'+options.class+'.display.export').html("");
  
  var btns = '<div class="btn-toolbar" role="toolbar" aria-label="..."> \
    <div class="btn-group" role="group" aria-label="..."> \
      <button type="button" class="btn btn-default ' + options.class + ' export format" value="json">JSON</button> \
      <button type="button" class="btn btn-info ' + options.class + ' export format" value="csv">CSV</button> \
    </div> \
    <div class="btn-group" role="group" aria-label="..."> \
      <button type="button" class="btn btn-info ' + options.class + ' export what" value="page">Page</button> \
      <button type="button" class="btn btn-default ' + options.class + ' export what" value="set">Set</button> \
      <button type="button" class="btn btn-default ' + options.class + ' export what" value="query">Query</button> \
    </div> \
    <div class="btn-group" role="group" aria-label="..."> \
      <button class="' + options.class + ' btn btn-primary" do="export">Export</button> \
    </div> \
  </div>';

  $('.'+options.class+'.export').append(btns);
  $('button.btn.'+options.class+'.export').bind('click',function() {
    var what = $(this).hasClass('format') ? 'format' : 'what';
    $('button.btn.'+options.class+'.export.'+what).removeClass('btn-info').addClass('btn-default');
    $(this).removeClass('btn-default').addClass('btn-info');
  });
  
}
  

