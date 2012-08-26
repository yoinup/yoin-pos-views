minispade.register('ember-data/system/record_arrays/filtered_record_array', function() {minispade.require("ember-data/system/record_arrays/record_array");

var get = Ember.get;

DS.FilteredRecordArray = DS.RecordArray.extend({
  filterFunction: null,

  replace: function() {
    var type = get(this, 'type').toString();
    throw new Error("The result of a client-side filter (on " + type + ") is immutable.");
  },

  updateFilter: Ember.observer(function() {
    var store = get(this, 'store');
    store.updateRecordArrayFilter(this, get(this, 'type'), get(this, 'filterFunction'));
  }, 'filterFunction')
});

});