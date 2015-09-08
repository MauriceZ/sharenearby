var posts, fileUpload;

Template.mainChat.onRendered(function() {
  scrollToBottom();

  posts.observeChanges({
    added: function(post) {
      if (Meteor.subscriptions.posts.ready()) {

        if (!Meteor.recentPostSentByUser) {
          var $previousNewestPost = $('.chat-post-container').eq(-2),
              inputSectionHeight = $('.chat-input-section').height();
          
          if (Meteor.utils.isScrolledIntoView($previousNewestPost, inputSectionHeight)) {
            scrollToBottom();
          } else {
            notifyNewMessage();
          }
        }

        Meteor.recentPostSentByUser = false;

      }
    }
  });
});

Template.mainChat.helpers({
  posts: function() {
    posts = Posts.find();
    return posts;
  },

  formattedDate: function() {
    return moment(this.createdAt).fromNow();
  },

  uploadedFileInfo: function() {
    return Session.get('uploadedFileInfo');
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
  },

  'change .file-input': function() {
    var uploadedFile = $('.file-input')[0].files[0];
    Session.set('uploadedFileInfo', fileToJSON(uploadedFile));
    var formData = new FormData($('.file-input-form')[0]);
    fileUpload = new FileUpload(formData, '.file-progress-bar');
    fileUpload.start();
  },

  'click .file-remove': function() {
    fileUpload.cancel();
  },
};

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

function fileToJSON(file) {
  return {
    name: file.name || "",
    size: file.size ? Math.floor(file.size/1000) : 0,
    type: file.type || ""
  };
}

function FileUpload(formData, progressBarClass) {
  this.formData = formData
  this.progressBarClass = progressBarClass;
}

FileUpload.prototype.start = function() {
  var self = this;

  $.ajax({
    url: 'https://file.io?expires=1',
    type: 'POST',
    data: self.formData,
    dataType: 'json',
    contentType: false,
    processData: false,

    xhr: function() {
      self.xhr = new window.XMLHttpRequest();

      self.xhr.upload.addEventListener('progress', function(e){
        if (e.lengthComputable) {
          var percentComplete = e.loaded / e.total;
          self.updateProgress(percentComplete);
        }
      }, false);
      
      return self.xhr;
    },

    success: function(data) {
      self.uploadInfo = data;
    }
  });
};

FileUpload.prototype.cancel = function() {
  var self = this;

  if (self.xhr) {
    self.xhr.abort();

    if (self.uploadInfo)
      $.get(self.uploadInfo.link);
  }

  $('.file-input-form')[0].reset();
  Session.set('uploadedFileInfo', null);
};

FileUpload.prototype.updateProgress = function(newValue) {
  $(this.progressBarClass).attr('value', newValue);
};

FileUpload.prototype.isInProgress = function() {
  var self = this;
  if (self.xhr)
    return self.xhr.readyState != 0 && self.xhr.readyState != 4;
  else
    return false;
};
