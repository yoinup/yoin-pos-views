minispade.register('yoin-views/views/states/is_loading', function() {// you must setup isLoading = true when resource is being loaded
Yn.IsLoading = Ember.Mixin.create({

  classNameBindings: ['isLoading'],
  isLoading: true,

  didInsertElement: function() {

    this._super();
    var self = this;
    this.$().load( function(el){
      self.set('isLoading', false);
    });

  }

});

});