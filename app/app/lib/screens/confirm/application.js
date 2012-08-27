
App = Me.Application.create({

	run: function() {

		this._super();
		Yvi.ConfirmScreenView.create().appendTo('#app');

  }

});
