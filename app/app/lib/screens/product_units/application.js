
App = Me.Application.create({

	run: function() {

		this.loadData();
		var self = this;

    var productUnits = App.store.findMany(Yn.ProductUnit, [1,2,3,4,5]);
		productUnits.one('didLoad', function(item) {

      self.view = Yvi.ProductUnitsScreenView.create({
        productUnits: productUnits
      });

      self.view.appendTo('#app');

		});

	}

});
