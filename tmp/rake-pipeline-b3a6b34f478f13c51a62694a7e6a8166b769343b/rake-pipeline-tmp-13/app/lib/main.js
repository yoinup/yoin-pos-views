minispade.register('app', function() {minispade.require('ember-touch');
minispade.require('ember-data');
minispade.require('ember-data-tastypie-adapter');
minispade.require('yoin-ember/init');
minispade.require('yoin-ember/system');
minispade.require('yoin-ember/analytics');
minispade.require('yoin-ember/local_store');
minispade.require('yoin-ember/data');

Yn.embedded = false;
minispade.require('yoin-ember/models');
minispade.require('yoin-ember/fixtures/initial');
minispade.require('yoin-views');
minispade.require('yoin-views-ipad');




Me = {};
minispade.require('app/utils/application');

});