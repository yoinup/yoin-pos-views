minispade.register('yoin-views/views/states/is_selected', function() {
Yn.IsSelected = Ember.Mixin.create({

  classNameBindings: ['isSelected'],

  isSelected: Em.computed(function(){
    return ( this.get('content') === this.get('selected') );
  }).property('selected', 'content')

});

});