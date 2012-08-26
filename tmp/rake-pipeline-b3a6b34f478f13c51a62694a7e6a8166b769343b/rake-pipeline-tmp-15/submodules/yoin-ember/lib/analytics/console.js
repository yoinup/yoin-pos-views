minispade.register('yoin-ember/analytics/console', function() {Yn.AnalyticsConsole = Yn.Analytics.extend({

	logEvent: function(name, params) {

    var result = (params) ? Ember.String.fmt("%@ - %@", [name, params] ) : name;
		console.log( result );
	}

});

});