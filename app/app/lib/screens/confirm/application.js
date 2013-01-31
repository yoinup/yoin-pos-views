
App = Me.Application.create({

	run: function() {

		this.loadData();
		var self = this,
				user = this.store.find(Yn.User, 16),
				venue = this.store.find(Yn.Venue, 236),
				//invitations = this.store.findMany(Yn.Invitation, [1,2]),
				invitations = this.store.findMany(Yn.Invitation, [1,2,3]),
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
