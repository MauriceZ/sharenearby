var posts;

Template.mainChat.onRendered(function() {
  scrollToBottom();

  posts.observeChanges({
    added: function(post) {
      if (Meteor.subscriptions.public_posts.ready() && Meteor.subscriptions.locked_posts.ready()) {

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
    posts = Posts.find({}, { sort: { createdAt: 1 } });
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
  },

  'submit .chat-password-form': function(e) {
    e.preventDefault();
    var password = e.target.elements.password.value;

    Meteor.subscribe('unlocked_post', this._id, password, function onReady() {
      if (!unlockedPosts.hasNew() && e.target.className.indexOf('has-error') < 0) { // password is wrong
        e.target.className += ' has-error';
      }
    });
  }
};

var unlockedPosts = (function() {
  var oldCount = 0;

  var unlockedPostObj = {
    oldCount: function() {
      return oldCount;
    },

    currentCount: function() {
      return Posts.find({ body: { $exists: true }, password: { $exists: true } }).count();
    },

    updateCount: function() {
      oldCount = this.currentCount();
    },

    hasNew: function() {
      if (this.oldCount() < this.currentCount()) {
        this.updateCount();
        return true;
      }

      return false;
    }
  };

  return unlockedPostObj;
})();

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
