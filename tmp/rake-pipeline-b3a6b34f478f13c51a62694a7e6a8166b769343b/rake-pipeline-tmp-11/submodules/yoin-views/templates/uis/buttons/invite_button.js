
Ember.TEMPLATES['invite_button'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var buffer = '', stack1, stack2, stack3, stack4, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;


  data.buffer.push("<div class=\"invite-button-inner\">\n\n  <div class=\"invite-button-vertical-line is-left\"></div>\n  <div class=\"invite-button-horizontal-line is-left\"></div>\n\n  <div class=\"invite-text l-up button-text is-font-white\">");
  stack1 = depth0;
  stack2 = "invite";
  stack3 = {};
  stack4 = true;
  stack3['toUpperCase'] = stack4;
  stack4 = helpers.I18n || depth0.I18n;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "I18n", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "</div>\n\n  <div class=\"invite-button-circle\"></div>\n\n  <div class=\"invite-text l-down button-text is-font-white\">2 $</div>\n\n  <div class=\"invite-button-horizontal-line is-right\"></div>\n  <div class=\"invite-button-vertical-line is-right\"></div>\n\n</div>\n");
  return buffer;
});
