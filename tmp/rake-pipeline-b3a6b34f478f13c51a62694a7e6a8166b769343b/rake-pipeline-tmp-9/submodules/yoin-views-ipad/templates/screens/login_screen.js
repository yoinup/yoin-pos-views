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

Ember.TEMPLATES['login_screen'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var self=this;


  data.buffer.push("loginScreen ---> hola hola\n");
});
