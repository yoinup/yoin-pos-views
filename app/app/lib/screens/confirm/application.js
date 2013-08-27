
App = Me.Application.create({

	run: function() {

		this.loadData();
		var self = this,
				user, 
				venue,
        invitations,
				selectedInvitation;

    user = this.store.find(Yn.User, 16);
		user.addObserver('isLoaded', function() {

      venue = this.store.find(Yn.Venue, 236),
      venue.addObserver('isLoaded', function() {

        //invitations = this.store.findMany(Yn.Invitation, [1]);
        invitations = this.store.findMany(Yn.Invitation, [1,2]);
        //invitations = this.store.findMany(Yn.Invitation, [1,2,3]);
        invitations.addObserver('isLoaded', function() {

          selectedInvitation = invitations.get('firstObject');
          selectedInvitation.set('consumed', true);

          self.view = Yvi.ConfirmScreenView.create({
            user: user,
            venue: venue,
            isConsumed: true,
            selected: selectedInvitation
          });

          self.view.appendTo('#app');

        });

      });
		});

	}

});
