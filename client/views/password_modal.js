Template.passwordModal.events = {
  'shown.bs.modal #password-modal': function(e) {
    $(e.target).find('.modal-add-password-input').focus();
  },

  'submit .chat-add-password-form': function(e) {
    e.preventDefault();

    var password = e.target.elements.password.value;

    $('.new-post-password-input').val(password);
    Session.set('hasPassword', Boolean(password));

    $('#password-modal').modal('hide');
    Template.passwordModal.modalHiddenFromSubmit = true;
  },

  'hidden.bs.modal #password-modal': function(e) {
    if (!Template.passwordModal.modalHiddenFromSubmit) {
      var currentPassword = $('.new-post-password-input').val();
      $(e.target).find('.modal-add-password-input').val(currentPassword);
    }

    Template.passwordModal.modalHiddenFromSubmit = false;
  }
};

Template.passwordModal.helpers({
  fade: function() {
    if (Meteor.Device.isDesktop())
      return 'fade';
    else
      return '';
  }
});
