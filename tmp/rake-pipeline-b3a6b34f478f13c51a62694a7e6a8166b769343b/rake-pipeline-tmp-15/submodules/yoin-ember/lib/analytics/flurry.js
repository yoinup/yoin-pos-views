minispade.register('yoin-ember/analytics/flurry', function() {Yn.AnalyticsFlurry = Yn.Analytics.extend({

	init: function () {
		this._super();
		this.manager = window.plugins.FlurryPlugin;
	},

	logEvent: function(name, params) {
		this.manager.logEvent(name, params);
	}

});

});