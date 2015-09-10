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

Meteor.modules = { FileUpload: FileUpload };
