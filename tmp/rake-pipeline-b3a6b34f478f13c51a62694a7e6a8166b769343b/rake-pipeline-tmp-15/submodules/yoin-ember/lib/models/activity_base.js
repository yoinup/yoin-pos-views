minispade.register('yoin-ember/models/activity_base', function() {
Yn.ActivityBase = DS.Model.extend({
  user: DS.belongsTo('Yn.User', {key: 'user'}),
  product: DS.belongsTo('Yn.Product', {key: 'product'}),
  venue: DS.belongsTo('Yn.Venue', {key: 'venue'}),
  createdAt: DS.attr('date', {key: 'created_at'} )

});

});