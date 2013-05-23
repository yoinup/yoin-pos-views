
App = Me.Application.create({

	run: function() {

		this.loadData();
		var self = this;

		self.view = Yvi.ReportsScreenView.create({
		});

		self.view.appendTo('#app');

	}

});
