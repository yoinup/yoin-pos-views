
App = Me.Application.create({

	run: function() {

		this.loadData();
		var self = this;

    var products = this.store.findMany(Yn.Product, [41, 23, 37, 30, 42, 6]);
    products.addObserver('isLoaded', function() {
      self.view = Yvi.PromosScreenView.create({
        runningProducts: products,
        stoppedProducts: products
      });
      self.view.appendTo('#app');
    });


	}

});
