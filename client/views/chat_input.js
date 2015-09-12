var fileUpload;

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

  'change .file-input': function() {
    $('.chat-input').focus();

    if (!$('.file-input')[0].files.length)
      return;

    var uploadedFile = $('.file-input')[0].files[0];
    Session.set('uploadedFileInfo', Meteor.utils.fileToJSON(uploadedFile));

    var formData = new FormData($('.file-input-form')[0]);
    fileUpload = new Meteor.modules.FileUpload(formData);
    fileUpload.start();
  },

  'click .file-remove': function() {
    fileUpload.cancel();
    $('.chat-input').focus();
  },

  'submit #chat-form': function() {
    resetAll();
  }
};

function resetAll() {
  Session.set('uploadedFileInfo', null);
  Session.set('hasPassword', false);
  $('.chat-add-password-form')[0].reset();
  $('#chat-form')[0].reset();
  $('.file-input-form')[0].reset();
}
