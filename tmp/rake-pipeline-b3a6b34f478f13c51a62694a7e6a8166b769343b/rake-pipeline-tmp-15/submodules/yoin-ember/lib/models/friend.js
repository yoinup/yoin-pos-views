minispade.register('yoin-ember/models/friend', function() {
var embedded = Yn.embedded;
Yn.Friend = DS.Model.extend({
  user: DS.belongsTo('Yn.User', {key:"user", embedded: embedded})
});


Yn.Friend.reopenClass({
  url: "friend"

});

});