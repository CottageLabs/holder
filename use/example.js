
$.fn.holder.use.example = {};

$.fn.holder.use.example.previous = function(event) {
  if (event) event.preventDefault();
  if ( true ) { // if not at the start of the result set, and being sure not to go below zero, get the previous result set
      options.execute();
  }
}
$.fn.holder.use.example.next = function(event) {
  if (event) event.preventDefault();
  if ( true ) { // if not at the end of the result set, set the query to get the next result set
      options.execute();
  }
}
$.fn.holder.use.example.from = function() {
  // set options.query as necessary to define where to start the result set from (remember to check valid range)
  options.execute();
}
$.fn.holder.use.example.to = function() {
  // set options.query as necessary to define where to end the result set (remember to check valid range)
  options.execute();
}

$.fn.holder.use.example.add = function(event,th) {
  // this one is more complicated - it must define how to add to the query that gets submitted to the backend
  // it should be possible for this method to be called by anything on the UI defined as having the "add" function
  // remember also that it is possible to define separate methods too and assign them to UI elements
  // so for a more complex UI there could be different methods instead of overloading this one
  if (event) event.preventDefault(); // prevent default event
  if (!th) th = $(this); // set this from value passed in
  // set options.query back to the start, so that updated queries get the starting results again
  // check th for attrs that help define the query, and use those attrs to build the options.query
  // have a look at how the default elasticsearch ones in holder do this, and how it uses dot notations to help
  options.execute(); // execute once the query is ready
  if ( typeof options.after.add === 'function' ) options.after.add();
}
$.fn.holder.use.example.remove = function(event,th) {
  if (event) event.preventDefault();
  if (!th) th = $(this);
  // the dot notation found there should define how to remove a part of the options.query
  var tgt = th.attr('val').replace('options.','');
  dot(options, tgt, false); // update the options object
  th.remove(); // remove the element that triggered this
  // set the options.query from value back to zero, so the new query gets results from the start again 
  options.execute(); // then execute
  if ( typeof options.after.remove === 'function' ) options.after.remove();
}

$.fn.holder.use.example.suggest = function(event,th) {
  // this function is whatever needs done to prep for retrieving search dropdown suggestions from the backend
  // it binds to search text box on the UI, if necessary / possible
  if (event) event.preventDefault();
  if (!th) th = $(this);
  var code = (event.keyCode ? event.keyCode : event.which);
  if ( code == 13 ) {
    // done suggesting, do whatever needs done to tidy options.query and trigger an add
    options.add(event,th);
  } else {
    options.suggesting = true; // track that we are suggesting!
    // set the options.query back to from zero to get results from start again
    var v = th.val(); // get the suggestible value from this text box
    // do what is necessary to clear any previous suggest value from the options.query
    if ( v.length !== 0 ) {
      // do whatever is necessry to get the query value and prep it and put it into the options.query
    }
    options.execute(); // execute the query
  }
  if ( typeof options.after.suggest === 'function' ) options.after.suggest();
}

$.fn.holder.use.example.execute = function(event) {
  // can this be simplified so does not need to be defined for every dao?
  // show the loading placeholder (although one is not defined by default, it can be added anywhere to the page)
  $('.' + options.class + '.loading').show();
  $('.' + options.class + '.search').attr('placeholder','searching...');
  // get the current query
  if (options.query === undefined) options.initialisequery();
  // do whatever is necessary to prep the options.query
  var tq = options.query; // get a local copy of the query
  if ( options.scrolling ) {
    // remove anything not necessary for a simple scrolling results query
  }
  // TODO could simplify query if suggesting on facets, drop out ones that are not needed and set result size to zero
  // set the ajax options then execute
  var opts = {
    url: options.url,
    type: options.type,
    cache: false,
    //contentType: "application/json; charset=utf-8",
    dataType: options.datatype,
    // TODO: may have to pass this context in for the success object to run... check once online
    success: function(resp) {
      //obj = $(this); TODO check if this works with or without passing the this context
      $('.' + options.class + '.loading').hide();
      options.response = resp;
      // now do whatever should be done on success
    },
    error: function(resp) {
      // do whatever is deemed necessary on error
      console.log('Terribly sorry chappie! There has been an error when executing your query.');
    }
  };
  opts.url += '?source=' + encodeURIComponent(JSON.stringify(tq)); // whatever is necessary to send the query
  $.ajax(opts);
  if ( typeof options.after.execute === 'function' ) options.after.execute();
}

$.fn.holder.use.example.render = function() {
  // must be able to render any given query for this dao to the page UI - buttons, etc
  // define what to say in the UI about the found results, remember the options.what parameter that helps customise this
  // set query into url if possible and desired
  $('.' + options.class + '.from').val(); // update from and to on the page from the options.query
  $('.' + options.class + '.to').val();
  $('.' + options.class + '.filters').html(""); // clear the currently displayed filters
  for ( var q in [] ) {
    // for each thing in the part of the options.query that defines something that can be selected
    // show it on the page somehow by presenting it as a button in the holder-filters area
    // see how the defaults in holder do this for the es query part
  }
  // as with the default ES function in holder, other loops may be required to build into the UI holder-filters
  // so that there are buttons that define each part of the query and give a holder-remove dot notation route
  // so that if said button in holder-filters is clicked, it removes that part of the options.query
  if ( typeof options.after.render === 'function' ) options.after.render();
}
