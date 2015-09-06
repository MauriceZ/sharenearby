Posts = new Mongo.Collection('posts');
Posts.attachSchema(PostSchema);

Posts.after.insert(function() {
  if (Meteor.isClient) {
    Meteor.utils.scrollToBottom($('.chat-posts-container'));
  }
});
