function defineSimpleService(name){
	app.service(name, function () {
		var property = null;

	    return {
	    	grab:function () {
	        	return property;
	        },
	        place:function (value) {
	        	property = value;
	        }
	    };
	});
}
		
defineSimpleService("currentDebate");

app.factory('loadingService', function() {
  var service = {
    requestCount: 0,
    isLoading: function() {
      return service.requestCount > 0;
    }
  };
  return service;
});

app.factory('onStartInterceptor', function(loadingService) {
  return function (data, headersGetter) {
    loadingService.requestCount++;
    return data;
  };
});

app.factory('onCompleteInterceptor', function(loadingService) {
  return function(promise) {
    var decrementRequestCount = function(response) {
      loadingService.requestCount--;
      return response;
    };
    return promise.then(decrementRequestCount, decrementRequestCount);
  };
});

app.config(function($httpProvider) {
  $httpProvider.responseInterceptors.push('onCompleteInterceptor');
});

app.run(function($http, onStartInterceptor) {
  $http.defaults.transformRequest.push(onStartInterceptor);
});

app.controller('LoadingCtrl', function($scope, loadingService) {
  $("#spinner").spin();
  $scope.$watch(function() { return loadingService.isLoading(); }, function(value) { $scope.loading = value; });
});