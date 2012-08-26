minispade.register('yoin-ember/data/cache', function() {Yn.cacheStore = {

  save: function(destinationKey, content) {
    var attributes,
      associations,
      jsonObject,
      jsonArray;

    jsonArray = [];

    if (!!content) {
      content.forEach(function(item, index, collection) {

        jsonArray.push(item.toJSON({ associations: true}));
        
      });
    }

    localStorage.setItem(destinationKey, JSON.stringify(jsonArray));
  },

  load: function(type) {
    var array;
    var json = localStorage.getItem(type.toString());
    
    if (!!json) {
      array = DS.RecordArray.create({ type: type, content: Ember.A([]), store: Yn.store });
      Yn.store.registerRecordArray(array, type);
      Yn.store.loadMany(type, JSON.parse(json) );
      Yn.store.typeMapFor(type).findAllCache =  array;
      array.set('isLoaded', true);
      return array;
    }
  }
};

});