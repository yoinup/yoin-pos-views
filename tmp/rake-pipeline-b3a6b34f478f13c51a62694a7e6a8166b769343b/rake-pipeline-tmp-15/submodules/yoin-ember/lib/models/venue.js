minispade.register('yoin-ember/models/venue', function() {Yn.Venue = DS.Model.extend({
  code: DS.attr('string'),
  name: DS.attr('string'),
  address: DS.attr('string'),
  zip: DS.attr('string', {key: 'zip_code'}),

  lat: DS.attr('number'),
  lon: DS.attr('number'),

  distance: DS.attr('number'),

  brand: DS.belongsTo('Yn.Brand', {key: "brand"}),
  city: DS.belongsTo('Yn.City', {key: "city"}),
  products: DS.hasMany('Yn.Product', {key:"products"}),
  nearUsers: DS.hasMany('Yn.User', {key:"near_users"}),


  commentCount: DS.attr('number', {key: 'comment_count'}),
  likeCount: DS.attr('number', {key: 'like_count'}),

  hasVoted: DS.attr('boolean', {key: 'has_voted'}),

  hasLikes: Em.computed(function() {
    return this.get('likeCount') > 0;
  }).property('likeCount'),

  hasComments: Em.computed(function() {
    return this.get('commentCount') > 0;
  }).property('commentCount')

});

// Explicit name to avoid ember-data bugs
Yn.Venue.reopenClass({
  url: "venue"
});

});