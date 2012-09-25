
App = Me.Application.create({

	run: function() {

		this._super();
		Yvi.EmptyScreenView.create().appendTo('#app');

  }

});
