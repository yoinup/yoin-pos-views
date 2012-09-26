
App = Me.Application.create({

	run: function() {

		var self = this,
				venueUser = this.store.find(Yn.User, 17),
				user = this.store.find(Yn.User, 16),
				venue = this.store.find(Yn.Venue, 236),
				invitations = this.store.find(Yn.Invitation, 1)
				products = this.store.find(Yn.Product, {'limit': 2});

    invitations.addObserver('isLoaded', function(item) {

      self.view = Yvi.ConfirmScreenView.create({
        venueUser: venueUser,
        user: user,
        venue: venue,
        invitations: invitations,
        products: products
      });

      self.view.appendTo('#app');

    });

	}

});
