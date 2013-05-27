
App = Me.Application.create({

	run: function() {

		this.loadData();
		var self = this;

		self.view = Yvi.PromoScreenView.create({
      isExecuting: false,
      isNewElement: false
		});

		self.view.appendTo('#app');

	}

});
