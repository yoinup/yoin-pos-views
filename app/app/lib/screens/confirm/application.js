
App = Me.Application.create({

	run: function() {

		this.loadData();
		var self = this,
				user,
				productUnit,
				venue,
        invitations,
				selectedInvitation;

    user = this.store.find(Yn.User, 16);
		user.addObserver('isLoaded', function() {

			productUnit = self.store.find(Yn.ProductUnit, 1);
			productUnit.addObserver('isLoaded', function() {

				venue = self.store.find(Yn.Venue, 236),
				venue.addObserver('isLoaded', function() {

					//invitations = this.store.findMany(Yn.Invitation, [1]);
					invitations = self.store.findMany(Yn.Invitation, [1,2]);
					invitations.addObserver('isLoaded', function() {

						selectedInvitation = invitations.get('firstObject');
						selectedInvitation.set('consumed', false);
						selectedInvitation.set('expired', true);

						selectedInvitation = null;
						productUnit.set('consumed', true);

						self.view = Yvi.ConfirmScreenView.create({
							user: user,
							venue: venue,
							isConsumed: true,
							selected: selectedInvitation,
							productUnit: productUnit
						});

						self.view.appendTo('#app');

					});

				});
			});
		});

	}

});
