minispade.register('yoin-ember/models/comment', function() {Yn.Comment = Yn.ActivityBase.extend({

  comment: DS.attr('string')

});

Yn.Comment.reopenClass({
  url: "comment"
});

});