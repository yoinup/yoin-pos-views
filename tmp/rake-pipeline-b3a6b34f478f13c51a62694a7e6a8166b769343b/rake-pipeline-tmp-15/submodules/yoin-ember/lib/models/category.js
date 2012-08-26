minispade.register('yoin-ember/models/category', function() {
Yn.Category = DS.Model.extend({
  name: DS.attr('string'),
  icon: DS.attr('string'),
  subcategory: DS.attr('number'),
  order: DS.attr('number')
});

// Explicit name to avoid ember-data bugs
Yn.Category.reopenClass({
  url: "category"
});

});