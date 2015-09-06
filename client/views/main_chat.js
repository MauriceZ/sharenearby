var posts;

Template.mainChat.helpers({
  posts: function() {
    posts = Posts.find();
    return posts;
  },

  formattedDate: function() {
    return moment(this.createdAt).fromNow();
  }
});

Template.mainChat.events = {
  'click .new-msg-notification': function() {
    scrollToBottom();
  },

  'keypress .chat-input': function(e) {
    if (e.keyCode == 13 && !e.ctrlKey) {
      e.preventDefault();
      $('#chat-form').submit();
    }
  }
};

Template.mainChat.onRendered(function() {
  scrollToBottom();

  posts.observeChanges({
    added: function(post) {
      if (Meteor.subscriptions.posts.ready()) {

        if (!Meteor.recentPostSentByUser) {
          Meteor.recentPostSentByUser = false;

          var $previousNewestPost = $('.chat-post-container').eq(-2),
              inputSectionHeight = $('.chat-input-section').height();
          
          if (Meteor.utils.isScrolledIntoView($previousNewestPost, inputSectionHeight)) {
            scrollToBottom();
          } else {
            notifyNewMessage();
          }
        }

      }
    }
  });
});

function scrollToBottom() {
  Meteor.utils.scrollToBottom($('.chat-post-container'));
}

function notifyNewMessage() {
  var $newMsgNotification = $('.new-msg-notification');
  $newMsgNotification.fadeIn(550);

  setTimeout(function() {
    $newMsgNotification.fadeOut(500);
  }, 5000);
}
