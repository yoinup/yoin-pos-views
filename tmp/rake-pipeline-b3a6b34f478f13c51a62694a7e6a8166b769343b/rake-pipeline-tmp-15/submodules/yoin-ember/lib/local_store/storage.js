minispade.register('yoin-ember/local_store/storage', function() {//https://github.com/twilio/BankersBox ( do redis style )
// 
// wrap the localStorage api 
// Allow to set/get JSON objects
//
// TODO: secure HASH for get-set
Yn.LocalStoreStorage = Em.Object.extend({

  has: function(key) {
    return localStorage.hasOwnProperty(key);
  },

  get: function(key) {

    var resultString = localStorage.getItem(key),
        result;

    try {
      result = JSON.parse(resultString);
    }
    catch(e) {
      result = resultString;
    }

    return result;
  },

  set: function(key, value) {

    if( typeof value === 'object' ) {
      value = JSON.stringify(value);
    }

    localStorage.setItem(key, value);
  },

  del: function(key) {
    delete localStorage[key];
  }

});

});