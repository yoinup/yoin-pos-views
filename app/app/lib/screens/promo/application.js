
App = Me.Application.create({

	run: function() {

		this.loadData();
		var self = this;

		self.view = Yvi.PromoScreenView.create({
		});

		self.view.appendTo('#app');

	}

});
