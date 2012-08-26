minispade.register('yoin-views/views/uis/buttons/toggle_circle_button', function() {Yn.ToggleCircleButtonView = Em.ContainerView.extend(Yn.Btap, {

  classNames: ['toogle-circle-button'],
  classNameBindings: ['isSelected'],

  selected: null,
  content: null,

  childViews: ['child'],

  child: Em.View.extend({
    classNames: ['toogle-circle-button-inner']
  }),
  
  actionContentBinding: Em.Binding.oneWay('content'),

  isSelected: Em.computed(function(){

    return this.get('selected') === this.get('content');

  }).property('selected', 'content')


});

});