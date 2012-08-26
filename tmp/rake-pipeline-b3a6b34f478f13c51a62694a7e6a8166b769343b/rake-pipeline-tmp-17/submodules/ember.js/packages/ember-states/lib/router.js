minispade.register('ember-states/router', function() {minispade.require('ember-states/state');
minispade.require('ember-states/route_matcher');
minispade.require('ember-states/routable');

Ember.Router = Ember.StateManager.extend({
  route: function(path) {
    if (path.charAt(0) === '/') {
      path = path.substr(1);
    }

    this.send('routePath', path);
  }
});

});