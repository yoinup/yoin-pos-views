minispade.register('yoin-ember/models/brand', function() {
Yn.Brand = DS.Model.extend({
  name: DS.attr('string'),
  picture: DS.attr('string')
});

// Explicit name to avoid ember-data bugs
Yn.Brand.reopenClass({
  url: "brand"
});

});