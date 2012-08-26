minispade.register('yoin-ember/data/adapter', function() {
var get = Ember.get, set = Ember.set, getPath = Ember.getPath;

/*
 * The DjangoTastypie Adapter extends the default RESTAdapter
 * from Ember.js in order to work with a REST interface provided
 * by django-tastypie.
 *
 * Some details of implementation of that library that differ
 * from the Rails oriented RESTAdapter are:
 * - Sent data must be stringified.
 * - Sent data must include a CONTENT_TYPE='application/json' header
 * - There are no plurals for collection of objects
 * - Returned objects are not inside a json[root] object
 * - Bulk Commits are not supported by default
 *
 */

Yn.DjangoTastypieAdapter = DS.DjangoTastypieAdapter.extend({

  /*
   * API credential to be inserted in the ajax requests
   */
  authHeader: null,


  init: function() {
    this._super();

  },

  /*
   * Create a record in the Django server. POST actions must
   * be enabled in the Resource
   */
  createRecord: function(store, type, model) {
    var self = this;

    var root = this.rootForType(type);

    var data = this._urlifyData(type, model);

    this.ajax(root, "POST", {
      data: data,
      success: function(json) {
        json = self._deurlifyData(type, json);
        store.didCreateRecord(model, json);
      },
      error: function(error) {

        model.fire('didCreateError', error);

      }
    });
  },

  /*
   * Edit a record in the Django server. PUT actions must
   * be enabled in the Resource
   */
  updateRecord: function(store, type, model) {
    var self = this;
    
    var id = get(model, 'id');
    var root = this.rootForType(type);

    var data = this._urlifyData(type, model);

    var url = [root, id].join("/");

    this.ajax(url, "PUT", {
      data: data,
      success: function(json) {
        json = self._deurlifyData(type, json);
        store.didUpdateRecord(model, json);
      },
      error: function(error) {
        model.fire('didUpdateError', error);
      }
    });
  },

  deleteRecord: function(store, type, model) {

    var id = Em.get(model, 'id'),
        root = this.rootForType(type),
        url = [root, id].join("/");

    this.ajax(url, "DELETE", {
      success: function(json) {
        store.didDeleteRecord(model);
      },
      error: function(error) {
        model.fire('didDeleteError', error);
      }
    });
  },

  /*
   * A temporal error manager for ember-data in findQueries
   */
  findQuery: function(store, type, query, recordArray){
    var self = this;
    var root = this.rootForType(type);

    this.ajax(root, "GET", {
      data: query,
      success: function(json) {
        json["objects"].forEach(function(item, i, collection) {
          collection[i] = self._deurlifyData(type, item);
        });
        recordArray.load(json["objects"]);
      },
      error: function(xhr) {
        recordArray.set('isError', true);
      }
    });
  },

  ajax: function(url, type, hash) {

    hash.cache = false;

    // If there is a locale defined, send the Accept-Language header
    if (typeof I18n !== "undefined" && !!I18n.defaultLocale) {
      hash.headers = jQuery.extend(hash.headers, {"Accept-Language": I18n.defaultLocale});
    }

    // If the user is logged in. Send his credentials
    if (!!this.get('authHeader')) {
      hash.headers = jQuery.extend(hash.headers, {
        "Authorization": this.get('authHeader')
      });
    }

    this._super(url, type, hash);
  }

});

});