minispade.register('yoin-ember/models/channels/phone_channel', function() {
Yn.PhoneChannel = DS.Model.extend({
  isValidated: DS.attr('boolean', {key: 'is_validated'}),
  phone: DS.attr('string')

});

Yn.PhoneChannel.reopenClass({
  url: "phone_channel"
});

});