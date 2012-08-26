minispade.register('yoin-ember/models/channels/fb_channel', function() {
Yn.FbChannel = DS.Model.extend({

  isValidated: DS.attr('boolean', {key: 'is_validated'}),
  name: DS.attr('string'),
  email: DS.attr('string'),
  fbId: DS.attr('string', {key: 'fb_id'})


});

Yn.FbChannel.reopenClass({
  url: "fb_channel"
});

});