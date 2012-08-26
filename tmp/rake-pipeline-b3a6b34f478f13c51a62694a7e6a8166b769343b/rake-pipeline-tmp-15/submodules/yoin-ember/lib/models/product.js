minispade.register('yoin-ember/models/product', function() {
Yn.Product = DS.Model.extend({
  name: DS.attr('string'),
  icon: DS.attr('string'),
  picture: DS.attr('string'),
  description: DS.attr('string'),
  price: DS.attr('number'),


  category: DS.belongsTo('Yn.Category', {key: "category"}),
  brand: DS.belongsTo('Yn.Brand', {key:"brand"}),

  commentCount: DS.attr('number', {key: 'comment_count'}),
  likeCount: DS.attr('number', {key: 'like_count'}),

  hasVoted: DS.attr('boolean', {key: 'has_voted'} ),

  hasLikes: Em.computed(function() {
    return this.get('likeCount') > 0;
  }).property('likeCount'),

  hasComments: Em.computed(function() {
    return this.get('commentCount') > 0;
  }).property('commentCount')

});

Yn.Product.reopenClass({
  url: "product"
});

});