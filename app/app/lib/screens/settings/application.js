
App = Me.Application.create({

	run: function() {

		this.loadData();

		var self = this,
				brand = this.store.find(Yn.Brand, 21),
				cities = this.store.findMany(Yn.City, [9,10,11]);
				venue = this.store.find(Yn.Venue, 236);

		venue.addObserver('isLoaded', function() {

			self.view = Yvi.SettingsScreenView.create({
				venue: venue,
				brand: brand,
				cities: cities,
				showCameraDeviceButton: true,
				isDeviceFront: true,
        hasPendingAction: true,
				isSandbox: true
			});

			self.view.appendTo('#app');
		});


	}

});
