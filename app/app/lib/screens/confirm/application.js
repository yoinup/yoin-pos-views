
App = Me.Application.create({

	run: function() {

		var self = this,
				user = this.store.find(Yn.User, 16),
				venue = this.store.find(Yn.Venue, 236),
				invitations = this.store.find(Yn.Invitation, {'limit': 2}),
				selectedInvitation;

		invitations.addObserver('isLoaded', function() {

			selectedInvitation = invitations.get('firstObject');

			self.view = Yvi.ConfirmScreenView.create({
				user: user,
				venue: venue,
				invitations: invitations,
				selected: selectedInvitation
			});

			self.view.appendTo('#app');

		});

	}

});
