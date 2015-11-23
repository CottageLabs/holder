/**********************************

The DAO is the definition of how holder should talk to the backend system that returns the query results

Any DAO must define the methods that prepare and send queries based on page interactions, 
and prepare the returned results for use by results methods - which themselves must be defined.

By default holder will operate against elasticsearch query endpoints, and the example results methods 
are written assuming elasticsearch result objects. However, by writing a new dao here and including it 
into the config of holder, the methods for communication to the query endpoint can be overwritten.
Then new results methods that rely on that sort of data returned by the newly defined endpoint can be written.

To load a dao when initialising holder, set the dao option to be the name of the dao subobject that you write here. 

Then, include this file too in the html head of the page, before including holder. At config startup, holder will 
overwrite the methods defined within.

**********************************/

if ( dao === undefined ) var dao = {};
dao.example = {
  prev: function(event) {
    if (event) event.preventDefault();
    if ( true ) { // if not at the start of the result set
        // set the query to get the previous result set, making sure not to go below zero
        options.execute();
    }
    // every method can call an "after" method that can be defined in holder setup options
    if ( typeof options.after.prev === 'function' ) options.after.prev();
  },
  next: function(event) {
    if (event) event.preventDefault();
    if ( true ) { // if not at the end of the result set
        // set the query to get the next result set
        options.execute();
    }
    if ( typeof options.after.next === 'function' ) options.after.next();
  },
  from: function() {
    // set options.query as necessary to define where to start the result set from (remember to check valid range)
    options.execute();
    if ( typeof options.after.from === 'function' ) options.after.from();
  },
  to: function() {
    // set options.query as necessary to define where to end the result set (remember to check valid range)
    options.execute();
    if ( typeof options.after.to === 'function' ) options.after.to();
  },
  add: function(event,th) {
    // this one is more complicated - it must define how to add to the query that gets submitted to the backend
    // it should be possible for this method to be called by anything on the UI defined as having the "add" function
    // remember also that it is possible to define separate methods too and assign them to UI elements
    // so for a more complex UI there could be different add methods defined
    scrollin($('.' + options.class + '.holder-search')); // scroll to the search box in the UI
    $('.' + options.class + '.holder-options').hide('fast'); // hide options that were on display
    if (event) event.preventDefault(); // prevent default event
    if (!th) th = $(this); // set this from value passed in
    // set options.query back to the start, so that updated queries get the starting results again
    // check th for attrs that help define the query, and use those attrs to build the options.query
    // have a look at how the default elasticsearch ones in holder do this, and how it uses dot notations to help
    options.execute(); // execute once the query is ready
    if ( typeof options.after.add === 'function' ) options.after.add();

  },
  remove: function(event,th) {
    if (event) event.preventDefault();
    if (!th) th = $(this);
    // ideally the remove method should just be able to look for the holder-remove attribute
    // the dot notation found there should define how to remove a part of the options.query
    var tgt = th.attr('holder-remove').replace('options.','');
    dot(options, tgt, false);
    // this should remove the element that triggers this function 
    // (e.g. the button that represented this part of the query on the UI)
    th.remove();
    // set the options.query from value back to zero, so the new query gets results from the start again 
    options.execute(); // then execute
    if ( typeof options.after.remove === 'function' ) options.after.remove();
  },
  suggest: function(event,th) {
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
  },
  scrollresults: function() {
    // for infinite scrolling pages, check that there are more results to get
    // perhaps this should actually make a call to "add" and not require separate definition per dao
    if ( true ) {
      options.scrolling = true; // track that we are scrolling!
      // set the new options.query from number to get the next page/set of results
      options.execute(); // execute the new query
    }
    if ( typeof options.after.scrollresults === 'function' ) options.after.scrollresults();
  },
  defaultquery: {}, // this should be a JSON object of whatever the starting query is
  initialisequery: function() {
    // this is whatever needs done to the default query to create first query
    // so we can define some conveniences for getting initial settings from the holder setup options
    options.query = $.extend(true, {}, options.defaultquery); // then create the first query from the defaultquery
  },
  execute: function(event) {
    // can this be simplified so does not need to be defined for every dao?
    // show the loading placeholder (although one is not defined by default, it can be added anywhere to the page)
    $('.' + options.class + '.holder-loading').show();
    $('.' + options.class + '.holder-search').attr('placeholder','searching...');
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
            $('.' + options.class + '.holder-loading').hide();
            options.response = resp;
            if (!options.suggesting && !options.scrolling) options.render(); // don't render the query if it was just a suggestion update
            if ( typeof options.results === 'function' ) {
                options.results(options.response);
            } else if ( typeof options.results === 'object' ) {
                if ( options.scrolling ) {
                  options.results.scroll(options.response);
                  options.scrolling = false;
                } else if ( options.suggesting ) {
                  options.results.suggestions(options.response);                          
                  options.suggesting = false;
                } else {
                  for ( var r in options.results ) {
                      if ( typeof options.results[r] === 'function') {
                          options.results[r](options.response);
                      }
                  }
                }
            }
        },
        error: function(resp) {
            // TODO catching errors from the API may need to be smarter than this...
            console.log('Terribly sorry chappie! There has been an error when executing your query.');
        }
    };
    if ( options.type != 'POST' ) {
        opts.url += '?source=' + encodeURIComponent(JSON.stringify(tq));
    } else {
        // TODO: add the query as data to the ajax opts
    }
    if (options.username && options.password) opts.headers = { "Authorization": "Basic " + btoa(options.username + ":" + options.password) };
    $.ajax(opts);
    if ( typeof options.after.execute === 'function' ) options.after.execute();
  },
  render: function() {
    // must be able to render any given query for this dao to the page UI - buttons, etc
    // define what to say in the UI about the found results, remember the options.what parameter that helps customise this
    // set query into url if possible and desired
    if ( options.pushstate && (!options.suggesting && !options.scrolling ) ) {
        try {
            if ('pushState' in window.history) window.history.pushState("", "search", '?source=' + JSON.stringify(options.query));
        } catch(err) {
            console.log('pushstate not working! Although, note, it seems to fail on local file views these days...' + err);
        }
    }
    $('.' + options.class + '.holder-from').val(); // update from and to on the page from the options.query
    $('.' + options.class + '.holder-to').val();
    $('.' + options.class + '.holder-filters').html(""); // clear the currently displayed filters
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
}