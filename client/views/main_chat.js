Template.mainChat.helpers({
  posts: function() {
    return Posts.find({});
  },

  formattedDate: function() {
    return moment(this.createdAt).fromNow();
  }
});

Template.mainChat.onRendered(function() {
  var elem = this.find('.chat-posts-container');
  elem.scrollTop = elem.scrollHeight;
});
