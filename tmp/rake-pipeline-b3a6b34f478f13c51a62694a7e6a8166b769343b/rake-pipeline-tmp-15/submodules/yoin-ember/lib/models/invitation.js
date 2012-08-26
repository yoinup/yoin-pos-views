minispade.register('yoin-ember/models/invitation', function() {
/* TODO
 * venue_user --> en vez de venueuser ?
 * venue (opcional)
 */
Yn.Invitation = DS.Model.extend({

  createdAt: DS.attr('date', {key: 'created_at'}),

  product: DS.belongsTo('Yn.Product', {key: 'product'}),

  fromUser: DS.belongsTo('Yn.User', {key: 'from_user'}),
  toUser: DS.belongsTo('Yn.User', {key: 'to_user'}),

  msg: DS.attr('string'),

  consumed: DS.attr('boolean'),
  dateConsumed: DS.attr('date'),
  venueUser: DS.belongsTo('Yn.VenueUser', {key: 'venue_user'}),
  

  // optional to create invitation to a Non Yn.User
  type: DS.attr('string'),
  fbId: DS.attr('string', {key: 'fb_id'}),
  phone: DS.attr('string')


});

Yn.Invitation.reopenClass({
  url: "invitation"
});

});