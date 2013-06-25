
App = Me.Application.create({

	run: function() {

		this.loadData();
		Yvi.ScanScreenView.create({ 
      hasError: false,
      isExecutingAction: true
    }).appendTo('#app');

  }

});
