Meteor.subscriptions = {
  public_posts: Meteor.subscribe('public_posts', scrollToBottom),
  locked_posts: Meteor.subscribe('locked_posts', scrollToBottom)
};

function scrollToBottom() {
  Meteor.utils.scrollToBottom($('.chat-posts-container'));
}
