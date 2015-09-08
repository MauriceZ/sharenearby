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
    var uploadedFile = $('.file-input')[0].files[0];
    Session.set('uploadedFileInfo', fileToJSON(uploadedFile));
    var formData = new FormData($('.file-input-form')[0]);
    fileUpload = new FileUpload(formData, '.file-progress-bar', '.chat-file-input');
    fileUpload.start();
  },

  'click .file-remove': function() {
    fileUpload.cancel();
  },

  'submit #chat-form': function() {
    Session.set('uploadedFileInfo', null);
  }
};


function fileToJSON(file) {
  return {
    name: file.name || "",
    size: file.size ? Math.floor(file.size/1000) : 0,
    type: file.type || ""
  };
}

function FileUpload(formData, progressBarClass, fileInputClass) {
  this.formData = formData
  this.progressBarClass = progressBarClass;
  this.fileInputClass = fileInputClass;
}

FileUpload.prototype.start = function() {
  var self = this;

  self.xhr = $.ajax({
    url: 'https://file.io?expires=1',
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
      $(self.fileInputClass).val(data.link);
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
  var $progressBar = $(this.progressBarClass);
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
