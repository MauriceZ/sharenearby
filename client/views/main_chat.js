var posts;

Template.mainChat.onRendered(function() {
  scrollToBottom();

  posts.observeChanges({
    added: function(post) {
      if (Meteor.subscriptions.posts.ready()) {

        if (!Meteor.recentPostSentByUser) {
          var $previousNewestPost = $('.chat-post-container').eq(-2),
              inputSectionHeight = $('.chat-input-section').height();
          
          if (Meteor.utils.isScrolledIntoView($previousNewestPost, inputSectionHeight)) {
            setTimeout(scrollToBottom);
          } else {
            notifyNewMessage();
          }
        }

        Meteor.recentPostSentByUser = false;

      }
    }
  });

  defineUIHooks(this);
});

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

  'click .chat-file-download': function(e) {
    Meteor.call('removePost', this);
  }
};

function defineUIHooks(template) {
  template.find('.chat-posts-container')._uihooks = {
    removeElement: function(node) {
      $(node).fadeOut();
    }
  };
}

function scrollToBottom() {
  Meteor.utils.scrollToBottom($('.chat-posts-container'));
}

function notifyNewMessage() {
  var $newMsgNotification = $('.new-msg-notification');
  $newMsgNotification.fadeIn(550);

  setTimeout(function() {
    $newMsgNotification.fadeOut(500);
  }, 5000);
}
