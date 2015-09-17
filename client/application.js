Meteor.subscriptions = {
  public_posts: Meteor.subscribe('public_posts', scrollToBottom),
  locked_posts: Meteor.subscribe('locked_posts', scrollToBottom),

  user_color: Meteor.subscribe('user_color', parseInt(localStorage.colorId), parseInt(localStorage.lastAssignedAt), function onready() {
    var colorAssignment = ColorAssignments.findOne();
    localStorage.colorId = colorAssignment.colorId;
    localStorage.lastAssignedAt = colorAssignment.lastAssignedAt;

    $('.chat-input-info').popover({
      html: true,
      placement: 'top',
      trigger: 'hover',
      content: '<div class="chat-info-popover"><h4 class="chat-info-header">IP:</h4><span class="chat-info-ip">' + colorAssignment.ipAddress + '</span><h4 class="chat-info-header">Color:</h4><div class="chat-info-color" style="background-color: ' + colorAssignment.hexCode + '"></div></div>'
    });
  }),
};

function scrollToBottom() {
  Meteor.utils.scrollToBottom($('.chat-posts-container'));
}
