var fileUpload, myDropzone;
setupDropzone();

Template.chatInput.helpers({
  uploadedFileInfo: function() {
    return Session.get('uploadedFileInfo');
  },

  hasPassword: function() {
    return Session.get('hasPassword');
  },

  submitDisabled: function() {
    return Session.get('fileUploading');
  }
});

Template.chatInput.events = {
  'keypress .chat-input': function(e) {
    if (e.keyCode == 13 && !e.ctrlKey) {
      e.preventDefault();
      $('#chat-form').submit();
    }
  },

  'change .file-input': function(e) {
    $('.chat-input').focus();

    if (!e.target.files.length && !myDropzone.files.length)
      return;
    else
      cancelCurFileUpload();

    var formData = new FormData($('.file-input-form')[0]);

    var uploadedFile = e.target.files[0];
    $('.file-input-form')[0].reset();

    if (myDropzone.files.length) {
      uploadedFile = myDropzone.files[0];
      formData.append('file', uploadedFile);
      myDropzone.removeAllFiles();
    }

    Session.set('uploadedFileInfo', Meteor.utils.fileToJSON(uploadedFile));

    fileUpload = new Meteor.modules.FileUpload(formData);

    Session.set('fileUploading', true);
    fileUpload.start({
      success: function(url) {
        $('.chat-file-url-input').val(url);
        Session.set('fileUploading', false);
      },

      error: function() { Session.set('uploadedFileInfo', { error: true }); }
    });
  },

  'click .file-remove': function() {
    cancelCurFileUpload();
    $('.chat-input').focus();
  },

  'submit #chat-form': function() {
    resetAll();
  }
};

function setupDropzone() {
  $(function() {
    myDropzone = new Dropzone('body', {
      url: 'not used',
      clickable: false,
      autoProcessQueue: false,

      dragover: function() { $('.dropzone-overlay').show(); },
      dragleave: function() { $('.dropzone-overlay').hide(); },
      drop: function() { $('.dropzone-overlay').hide(); },

      addedfile: function(file) {
        $('.file-input').trigger('change');
      }
    });
  });
}

function cancelCurFileUpload() {
  if (fileUpload) {
    fileUpload.cancel();
    fileUpload = null;
    Session.set('fileUploading', false);
    Session.set('uploadedFileInfo', null);
  }
}

function resetAll() {
  Session.set('uploadedFileInfo', null);
  Session.set('hasPassword', false);
  $('.chat-add-password-form')[0].reset();
  $('#chat-form')[0].reset();
  $('.file-input-form')[0].reset();
}
