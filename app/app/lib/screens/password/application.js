
App = Me.Application.create({

	run: function() {

		this.loadData();
		var self = this;

		self.view = Yvi.PasswordScreenView.create({
		});

		self.view.appendTo('#app');

	}

});
