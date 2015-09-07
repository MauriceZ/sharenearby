Meteor.subscriptions = {
  posts: Meteor.subscribe('posts', function onReady() {
    Meteor.utils.scrollToBottom($('.chat-posts-container'));
  })
};
