app.filter('nolinks', function () {
	return function (text) {
		var urlRegex = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/gi;

		return text.replace(urlRegex,' ');
    };
});

app.filter('titlify', function () {
	return function (text) {
		var result = "";
		text = text.replace(/_/g,' ');
		text.split(" ").forEach(function(w){
			result = result + w.charAt(0).toUpperCase() + w.substr(1) + " ";
		});
		return result;
    };
});
		
app.filter('onlylinkify', function () {
	return function (text) {
		var urlRegex = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/gi;

		var a = text.match(urlRegex);
		if(a != null){
			a = a.map(function(i){
				i = $.trim(i);
				if(i.match(/^http:\/\//) == null)
					return "http://" + i;
				else
					return i;
			});
			a = a.filter(function(i,pos){
				return (a.indexOf(i) == pos) && i != null;
			});
		}
		else
			a = [];
		
		return a;
    };
});

app.filter('norules', function () {
	return function (text) {
		var ruleRegex = /#[A-Z-a-z_ ]+\([0-9]+(\,[0-9]+)*\)/g;
		return text.replace(ruleRegex,' ');
    };
});

app.filter('onlyrules', function () {
	return function (text) {
		var ruleRegex = /#[A-Z-a-z_ ]+\([0-9]+(\,[0-9]+)*\)/g;
		var a = text.match(ruleRegex);
		if(a == null){
			a = [];
		}
		else{
			a = a.map(function(i){
				return i = $.trim(i).substring(1,i.length).toUpperCase();
			});
		}
		return a;
    };
});