
App = Me.Application.create({

	run: function() {

		this._super();
		Yvi.InitScreenView.create().appendTo('#app');

  }

});
