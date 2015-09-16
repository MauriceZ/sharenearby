Meteor.subscriptions = {
  public_posts: Meteor.subscribe('public_posts', scrollToBottom),
  locked_posts: Meteor.subscribe('locked_posts', scrollToBottom),

  user_color: Meteor.subscribe('user_color', parseInt(localStorage.colorId), parseInt(localStorage.lastAssignedAt), function onready() {
    var colorAssignment = ColorAssignments.findOne();
    localStorage.colorId = colorAssignment.colorId;
    localStorage.lastAssignedAt = colorAssignment.lastAssignedAt;
  }),
};

function scrollToBottom() {
  Meteor.utils.scrollToBottom($('.chat-posts-container'));
}
