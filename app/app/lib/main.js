
require('ember-touch');
require('ember-data');



require('yoin-ember/init');
require('yoin-ember/utils');
require('yoin-ember/system');
require('yoin-ember/analytics');
require('yoin-ember/local_store');
require('yoin-ember/data');

Yn.embedded = false;
require('yoin-ember/models');
require('yoin-ember/fixtures/initial');

require('yoin-views');
require('yoin-views-ipad');




Me = {};
require('app/utils/application');
