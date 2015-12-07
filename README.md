# Holder

This is a jquery app that provides an easy way to build web UIs onto queryable data API endpoints. By default it works against elasticsearch query endpoints.

The idea of it is that it makes it simple to build and send the queries, and leaves it up to you to build a UI that provides query building and results displays.

There are a number of conveniences so that such UIs can be quickly and easily constructed to requirements.


# HOWTO

The easiest way to see all the options is to look in jquery.holder.js and see the default options, or look at the various example html pages that are in this repo.

There are also some default functions that can be overridden, or to which callbacks can be passed, so that it is easy to extend or customise default functionality.

Having a look at index.html shows a simple setup where an html page has been put together using bootstrap for some neat layout.
The important and functional parts are the tags with class "holder". By default, any element that is going to have a function on the UI should be given the "holder" class.
It would be possible to run more than one instance of holder on a page by using a different classname such as "holder2" - the class to use is an option.
The functions can then be attached to the elements by further classnames that specify attachment to necessary functions. Functions are then attached automatically to the elements with those classnames.
The possible classname / function attachments are:

On this example we have holder-ui, holder-function, holder-search, holder-filters, holder-results.

Some of these are just for the purposes of UI - holder-ui just lets us know where all the holder stuff is. holder-filters is a div into which the selected filters of a query are inserted. 
holder-results is a div into which the results will be rendered. These are the default classnames for the default results functions. However, the results functions can be extended with callbacks or overwritten too.
Extending or overriding default functions is described below.

holder-search is a classname to bind an html input box as a search box - so, strings that are typed into it will trigger queries. How they trigger and what they trigger is controlled by the 
holder-function attribute on the element, in this case it is "suggest". This means that this search box is bound to a function called suggest. So this function either needs to exist as a default 
of holder (it does) or would have to be provided by extending holder.

The "suggest" function triggers an autosuggest behaviour - with a timeout defaulted to 500ms, it will take whatever is in the searchbox whenever keyup or blur occurs. 
It will then run the "suggest" results function if it exists (which by default it does), and this would provide suggestions. The searchbox could also be bound directly to the "search" function, 
which would just update the search results when executed.

The holder-function class can be seen attached to elements in this demo too, on the previous and next buttons - and they can be seen to have an "holder-function" attribute that defines their bound functions as 
"prev" and "next" which are two more default functions (with pretty obvious functionality).

Any function will automatically be bound to any "a", "input" or "textarea" element that has the default "holder" class and the "holder-function" class. The "holder-function" attribute of the element 
should then contain the name of the function to be called.

After the page layout itself, there is the javascript that instantiates holder. "what" - is just a useful string to display in any search box inbetween searching. 
"url" - is important, it is the endpoint where the queries need to be sent to. And then "datatype" ensures that the data sent to that endpoint is of the right type - 
likely to be JSON or JSONP (the endpoint should support cross-domain queries if it is not on the same domain as that on which the page is to be served).

That's all it takes to setup a simple search box with paging and results displayed just as they are in the raw JSON results object. It is not very exciting, but gets the basics done.


# OPTIONS

what - placeholder text to go in a search box, a simple way to describe what the UI does

class - the class that this holder will restrict itself to operating on (default holder)

url - the URL of the query endpoint where search results can be retrieved

type - the type of request to send to the URL (default GET)

datatype - the datatype to send to the URL (default JSONP)

defaultquery - the initial query upon which others are based (default is an elasticsearch query)

aggregations - a convenience to pass aggregations into the default query instead of having to provide a different default query

facets - a convenience to provide facets if your query endpoint is an old pre 1.0 elasticsearch, that uses facets instead of aggs

size - a convenience to set the size of result set that the default query should return too

query - can be defined at startup if necessary, but is also where the current query can be retrieved at any time

operator - the default query operator parameter for text search box queries

fuzzify - what sort of fuzzy match to apply to text queries (default is * )

executeonload - true by default, runs an initial query as soon as the page loads

pushstate - true by default, pushes changes to the query into the page URL so it can be used later (if the browser supports this)

scroll - false by default, but if true will add an "infinite scroll" feature to the page so more results are loaded when page bottom is reached

results - an object of results functions can be passed in, with key names that match the function to be performed after results are received (see default functions)

after - is an empty object by default. Put functions in here with key names that match any of the default functions, and they will be run as callbacks when that default function completes

response - not an option as such, but the response to any queries executed by holder will be stored here, so they are available to any other code you may want to access it from


# DEFAULT FUNCTIONS

The defaut functions, listed in order of a logical search and resut display workflow

ui - if the page that holder is called on does not contain at least an element with the "holder-search" class, a simple default UI will be built into the page

prev - augments the current query so that it can be executed again to get the previous result set

next - as "prev" but gets the next result set (so these perform paging)

from - if the page has an input with the "holder-from" class, this function will augment the current query so it can be executed to get results from the number provided

to - as "from" but sets the "to" value as necessary in the current query (so these perform page sizing)

add - the function to call on any page element that should add to the query. Have a look at how it works to buid new ones if necessary. Once the query is augmented, it executes it

remove - as "add" but removes the added item from the query and executes it

suggest - the function that should run to augment the query and execute it to return autocomplete values

scrollresults - defines how to call more results when page bottom is reached, if the scroll option is on. Uses the "next" function

initialisequery - prepares the query for first use, augmenting the default query by adding any facets / aggregations defined in the options, then setting the query equal to the default query

execute - executes the query by sending it to the query URL endpoint. On successful receipt of results, it calls render then results functions

render - renders the current query onto the page, once a result has been successfully received

results.suggestions - the default results functions include this one to build suggestions onto the UI as required for search box autocomplete

results.default - the default results function, takes result objects and inserts them into the holder-results div

results.scroll - what to do on receipt of query results when triggered by scrolling to the page bottom


# EXTENDING HOLDER

The most straightforward way is to use the "after" option when calling holder. Create functions with names matching those of the defaults, and they 
will be run after the default function is run, so it is an easy way to provide extra functionality.

Of course, handling the results that are returned from queries is highly likely to be something that you will want to extend, so that you get 
more than just a boring dump of the result object. This is easily done by using the "results" option and giving functions to run when the results are received.
Apart from the default results functions, which can themselves be overridden if necessary, any other function can be provided too and it will be run. Your function 
can expect to find the current query in options.query, and the current response in options.response.

A library of useful results functions is being compiled, and can be found in the "views" directory of the holder repository. Some of the html files in the root directory 
show examples of using some of those views, and it is as simple as calling those files in the page where holder will run, before holder is called, then when calling holder 
the names of the results functions defined in those files can be provided in the results object option parameter.

Also, it is possible to overwrite any default function when configuring holder. Just provide a function in the config options with a key name that matches that of 
one of the default functions, and it will be overridden.

Lastly, it is possible to override an entire set of functions using the "dao" feature. This is most useful if you wish to access a query endpoint that is not elasticsearch. 
In the "dao" directory of the holder repository you will find a file called example.js which defines an object called dao and a function in that object with the key name of example.
As is explained therein, you could write a completely new dao for your preferred backend search endpoint, and call it dao.mybackend for example; then, call your script before 
holder is called on the page on which it is to run so that the dao object is available, then when call holder with the name of your dao provided in the dao parameter e.g. 
holder({dao: "mybackend"}). All the functions you provide in your dao will replace any default functions with the same name, and any extra functions you define will be 
available as part of holder.







