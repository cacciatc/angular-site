app.directive('coolFade', function() {
	return {
    	compile: function(elm) {
        	$(elm).css('opacity', 0.1);
        	return function(scope, elm, attrs) {
       			$(elm).animate({ opacity : 1.0 }, 1000 );
       	 	};
     	}
   	};
});

app.directive('bounce', function() {
	return {
    	compile: function(elm) {

        	return function(scope, elm, attrs) {
	        		$(elm).addClass("animated");
					$(elm).addClass("bounce");
       	 	};
     	}
   	};
});

app.directive('slideRight', function() {
	return {
    	compile: function(elm) {
        	return function(scope, elm, attrs) {
	        		$(elm).addClass("animated");
					$(elm).addClass("fadeInRight");
       	 	};
     	}
   	};
});
app.directive('slideLeftBig', function() {
	return {
    	compile: function(elm) {
        	return function(scope, elm, attrs) {
	        		$(elm).addClass("animated");
					$(elm).addClass("fadeInLeftBig");
       	 	};
     	}
   	};
});
app.directive('slideDown', function() {
	return {
    	compile: function(elm) {
        	return function(scope, elm, attrs) {
	        		$(elm).addClass("animated");
					$(elm).addClass("fadeInDown");
       	 	};
     	}
   	};
});
		
app.directive('tooltip', function() {
	return {
    	compile: function(elm) {
			$(elm).attr("rel","tooltip");
        	return function(scope, elm, attrs) {
				$(elm).tooltip();
       	 	};
     	}
   	};
});

app.directive ('unfocus', function() { 
	return {
  		link: function (scope, element, attribs) { 
    		element[0].focus();
    		element.bind ("blur", function() {
        		scope.$apply(attribs["unfocus"]);
    		});      
		}
	}
});

// Register the 'myCurrentTime' directive factory method.
 // We inject $timeout and dateFilter service since the factory method is DI.
 app.directive('myCurrentTime', function($timeout, dateFilter) {
   // return the directive link function. (compile function not needed)
   return function(scope, element, attrs) {
     var format,  // date format
         timeoutId; // timeoutId, so that we can cancel the time updates
 
     // used to update the UI
     function updateTime() {
       element.text(dateFilter(new Date(), format));
     }
 
     // watch the expression, and update the UI on change.
     scope.$watch(attrs.myCurrentTime, function(value) {
       format = value;
       updateTime();
     });
 
     // schedule update in one second
     function updateLater() {
       // save the timeoutId for canceling
       timeoutId = $timeout(function() {
         updateTime(); // update DOM
         updateLater(); // schedule another update
       }, 1000);
     }
 
     // listen on DOM destroy (removal) event, and cancel the next UI update
     // to prevent updating time ofter the DOM element was removed.
     element.bind('$destroy', function() {
       $timeout.cancel(timeoutId);
     });
 
     updateLater(); // kick off the UI update process.
   }
 });