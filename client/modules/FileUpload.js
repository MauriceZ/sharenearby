function FileUpload(formData) {
  this.formData = formData
}

FileUpload.prototype.start = function(cbObj) {
  var self = this;
  self.isInProgress = true;

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
      self.isInProgress = false;
      self.uploadInfo = data;
      if (cbObj && cbObj.success) cbObj.success(data.link);
    },

    error: function(data) {
      if (cbObj && cbObj.error) cbObj.error(data.link);
    }
  });
};

FileUpload.prototype.cancel = function() {
  var self = this;
  self.isInProgress = false;

  if (self.xhr) {
    self.xhr.abort();

    if (self.uploadInfo)
      $.get(self.uploadInfo.link); // This deletes the file on file.io since they can only be downloaded once
  }
};

FileUpload.prototype.updateProgress = function(newValue) {
  var $progressBar = $('.file-progress-bar');
  $progressBar.attr('value', newValue);

  if (newValue == 1)
    $progressBar.fadeOut();
  else 
    $progressBar.show();
};

Meteor.modules = { FileUpload: FileUpload };
