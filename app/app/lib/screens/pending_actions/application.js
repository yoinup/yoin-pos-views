
App = Me.Application.create({

	run: function() {
		this.loadData();
		var self = this;

		var items = Em.A();
		items.pushObject({code: '1234'});
		items.pushObject({code: '1234'});
		items.pushObject({code: '1234'});

		self.view = Yvi.PendingActionsScreenView.create({
			items: items
		});

		self.view.appendTo('#app');
	}

});
