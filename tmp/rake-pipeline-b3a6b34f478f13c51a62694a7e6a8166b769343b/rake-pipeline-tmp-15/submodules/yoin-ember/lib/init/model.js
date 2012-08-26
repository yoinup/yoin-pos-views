minispade.register('yoin-ember/init/model', function() {
DS.Model.reopen({

  didCreateError: Ember.K,
  didUpdateError: Ember.K,
  didDeleteError: Ember.K

});

});