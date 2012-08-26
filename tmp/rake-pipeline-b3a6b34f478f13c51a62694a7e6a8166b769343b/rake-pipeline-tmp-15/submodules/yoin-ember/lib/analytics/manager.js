minispade.register('yoin-ember/analytics/manager', function() {Yn.AnalyticsManager = Yn.Analytics.extend({

	analytics: null,
	
	init: function () {
		this._super();

		if ( !this.analytics ) {

			this.analytics = Yn.AnalyticsNull.create();

		}



	},

	logEvent: function(name, params) {

			this.analytics.logEvent(name, params);

	}

});

});