minispade.register('yoin-ember/models/activity', function() {
var embedded = Yn.embedded;
Yn.Activity = DS.Model.extend({
  invitation: DS.belongsTo('Yn.Invitation', {key: 'invitation', embedded: embedded}),
  like: DS.belongsTo('Yn.Like', {key: 'like', embedded: embedded}),
  comment: DS.belongsTo('Yn.Comment', {key: 'comment', embedded: embedded}),

  isComment: Em.computed(function() {
    return !!this.get('comment');
  }).property('comment'),

  isLike: Em.computed(function() {
    return !!this.get('like');
  }).property('like'),

  isInvitation: Em.computed(function() {
    return !!this.get('invitation');
  }).property('invitation')

});


Yn.Activity.reopenClass({
  url: "activity"
});

});