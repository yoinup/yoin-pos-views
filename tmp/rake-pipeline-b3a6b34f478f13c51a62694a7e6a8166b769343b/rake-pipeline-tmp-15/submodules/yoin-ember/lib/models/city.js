minispade.register('yoin-ember/models/city', function() {
Yn.City = DS.Model.extend({
  name: DS.attr('string'),
  lat: DS.attr('number'),
  lon: DS.attr('number'),
  isDefault: DS.attr('boolean', {key: 'is_default'} )

});

// Explicit name to avoid ember-data bugs
Yn.City.reopenClass({
  url: "city"
});

});