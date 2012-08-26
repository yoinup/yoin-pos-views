minispade.register('ember-runtime/system/object', function() {// ==========================================================================
// Project:  Ember Runtime
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
minispade.require('ember-runtime/mixins/observable');
minispade.require('ember-runtime/system/core_object');
minispade.require('ember-runtime/system/set');

Ember.CoreObject.subclasses = new Ember.Set();

/**
  @class
  @extends Ember.CoreObject
  @extends Ember.Observable
*/
Ember.Object = Ember.CoreObject.extend(Ember.Observable);




});