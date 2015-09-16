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

  'click .chat-password-form > p': function(e) {
    var $p = $(e.target),
        $formInput = $p.siblings('.chat-password-input');
        $formBtn = $p.siblings('.chat-password-btn');

    if ($formInput.is(':hidden')) {
      $p.hide();
      $formInput.show();
      $formBtn.show();
    }

    $formInput.focus();
  },

  'submit .chat-password-form': function(e) {
    e.preventDefault();

    var password = e.target.elements.password.value;

    if (!password) {
      $(e.target).children('p').trigger('click');
      return;
    }

    Meteor.subscribe('unlocked_post', this._id, password, {
      onStop: function(error) {
        if (e.target.className.indexOf('has-error') < 0 && error.error == 'wrong_password') {
          e.target.className += ' has-error';
        }
      }
    });
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
