
$.fn.holder.display.range = function(obj) {
  var options = obj.holder.options;
  if (options.paging) return;
  
  if ( !$('.'+options.class+'.range').length ) {
    if ( $('.'+options.class+'.options').length ) {
      $('.'+options.class+'.options').append('<div class="' + options.class + ' display range"></div>');
    } else {
     obj.append('<div class="' + options.class + ' display range"></div>'); 
    }
  }
    
  $('.'+options.class+'.range').html("");
  
  // need to know what fields to offer range values on
  
  // if a value is clicked on screen, and it meets a range field name, should it be just searched on or used as range value?
  // how to decide which to do? exact search or range search?
  
  // for each field to range on, need to know the min and max values
  // these could be provided by a particular filter on the query, or two sorted queries to the backend returning just that field, asc then desc
  // so at start time, something needs to know how to get these values
  // and perhaps they have to change too, as other selections are made? In which case a facet/agg would be best approach
  // probably best to have the data review process know how to extract ranges?
  // this leans towards needing these displays to be able to add functionality onto the other methods too, then...
  
  // then draw a range slider with min and max value (possibly also select / datepicker) boxes at each end
  // on slide, update the box values
  // on box value change, bind to the usual add method
  
  // so add needs to know how to build a range filter into the query too
  
}
  

