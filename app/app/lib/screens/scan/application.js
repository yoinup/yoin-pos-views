
App = Me.Application.create({

	run: function() {

		this._super();
		Yvi.ScanScreenView.create().appendTo('#app');

  }

});
