
App = Me.Application.create({

	run: function() {

		this.loadData();
		var self = this,
				venueUser = this.store.find(Yn.User, 17);

    venueUser.addObserver('isLoaded', function(item) {

      self.view = Yvi.LoginScreenView.create({
        //venueUser: venueUser
      });

      self.view.appendTo('#app');

    });

	}

});
