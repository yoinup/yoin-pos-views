(function(){ 
        ENV = {
          VIEW_PRESERVES_CONTEXT:true,
          CP_DEFAULT_CACHEABLE:true
        };
      })();
minispade.require("ember-debug");
minispade.require("ember-metal");
minispade.require("ember-runtime");
minispade.require("ember-application");
minispade.require("ember-views");
minispade.require("ember-states");
minispade.require("metamorph");
minispade.require("ember-handlebars");

Ember.TEMPLATES['activity_button'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var self=this;


  data.buffer.push("<div class=\"activity-button-down\">\n  <div class=\"activity-button-down2\">\n  </div>\n</div>\n\n<div class=\"activity-button-text\">\n\n</div>\n");
});
