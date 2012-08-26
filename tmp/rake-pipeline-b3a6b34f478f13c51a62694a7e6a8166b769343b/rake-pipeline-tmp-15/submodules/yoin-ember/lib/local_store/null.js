minispade.register('yoin-ember/local_store/null', function() {
// Using LocalStore in our App must not be compulsory
Yn.LocalStoreNull = Em.Object.extend({

  has: function(key) {
    return false;
  },

  get: function(key) {
    return undefined;
  },

  set: function(key, value) {
  },

  del: function(key) {
  }

});


});