minispade.register('yoin-views-ipad/utils/application', function() {
Yn.Application.reopen({

	moduleLang: Em.computed(function(){
		return 'yoin-views-ipad/langs/';
	}).property()

});

});