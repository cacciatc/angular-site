var app = angular.module('debate', [])
	.value('$anchorScroll', angular.noop);
	
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

defineSimpleService("selectedDebate");
defineSimpleService("currentUser");