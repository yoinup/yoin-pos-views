
App = Me.Application.create({

	run: function() {

		this._super();
		Yvi.LoginScreenView.create().appendTo('#app');

  }

});
