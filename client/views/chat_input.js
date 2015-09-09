var fileUpload;

Template.chatInput.helpers({
  uploadedFileInfo: function() {
    return Session.get('uploadedFileInfo');
  }
});

Template.chatInput.events = {
  'keypress .chat-input': function(e) {
    if (e.keyCode == 13 && !e.ctrlKey) {
      e.preventDefault();
      $('#chat-form').submit();
    }
  },

  'change .file-input': function() {
    $('.chat-input').focus();

    if (!$('.file-input')[0].files.length)
      return;

    var uploadedFile = $('.file-input')[0].files[0];
    Session.set('uploadedFileInfo', fileToJSON(uploadedFile));

    var formData = new FormData($('.file-input-form')[0]);
    fileUpload = new FileUpload(formData);
    fileUpload.start();
  },

  'click .file-remove': function() {
    fileUpload.cancel();
    $('.chat-input').focus();
  },

  'submit #chat-form': function() {
    Session.set('uploadedFileInfo', null);
    $('#chat-form')[0].reset();
    $('.file-input-form')[0].reset();
  }
};


function fileToJSON(file) {
  return {
    name: file.name || "",
    size: file.size ? Math.floor(file.size/1000) : 0,
    type: file.type || ""
  };
}

function FileUpload(formData) {
  this.formData = formData
}

FileUpload.prototype.start = function() {
  var self = this;

  self.xhr = $.ajax({
    url: 'https://file.io/',
    type: 'POST',
    data: self.formData,
    dataType: 'json',
    contentType: false,
    processData: false,

    xhr: function() {
      var xhr = new window.XMLHttpRequest();

      xhr.upload.addEventListener('progress', function(e){
        if (e.lengthComputable) {
          var percentComplete = e.loaded / e.total;
          self.updateProgress(percentComplete);
        }
      }, false);
      
      return xhr;
    },

    success: function(data) {
      self.uploadInfo = data;
      $('.chat-file-url-input').val(data.link);
    }
  });
};

FileUpload.prototype.cancel = function() {
  var self = this;

  if (self.xhr) {
    self.xhr.abort();

    if (self.uploadInfo)
      $.get(self.uploadInfo.link); // This deletes the file on file.io since they can only be downloaded once
  }

  $('.file-input-form')[0].reset();
  Session.set('uploadedFileInfo', null);
};

FileUpload.prototype.updateProgress = function(newValue) {
  var $progressBar = $('.file-progress-bar');
  $progressBar.attr('value', newValue);

  if (newValue == 1)
    $progressBar.fadeOut();
  else 
    $progressBar.show();
};

FileUpload.prototype.isInProgress = function() {
  var self = this;
  if (self.xhr)
    return self.xhr.readyState != 0 && self.xhr.readyState != 4;
  else
    return false;
};
