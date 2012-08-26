minispade.register('yoin-ember/models/checkin', function() {Yn.Checkin = DS.Model.extend({
	lat: DS.attr('number'),
	lon: DS.attr('number')
});

Yn.Checkin.reopenClass({
  url: "checkin"
});

});