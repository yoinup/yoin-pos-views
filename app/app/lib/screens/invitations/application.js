
App = Me.Application.create({

	run: function() {

		this.loadData();
		var self = this;

    var invitations = App.store.findMany(Yn.Invitation, [1,2,3,4,5]);
		invitations.one('didLoad', function(item) {

      self.view = Yvi.InvitationsScreenView.create({
        pendingInvitations: invitations,
        consumedInvitations: invitations,

				option: Yvi.InvitationsOption.consumed
      });

      self.view.appendTo('#app');

		});

	}

});
