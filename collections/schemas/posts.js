var postFields = {
  _id: {
    'type': String,
    'optional': true,
    'autoform': {
      omit: true
    }
  },

  body: {
    type: String,
    autoform: {
      'label': false,
      'autofocus': '',
      'optional': true,
      'placeholder': '',
      'class': 'chat-input',
      'formgroup-class': 'chat-input-container col-md-10',
      'type': 'textarea',
      'rows': 5
    }
  },

  userId: {
    'type': String,
    'optional': true,
    'autoform': {
      omit: true
    }
  },

  ipAddress: {
    'type': String,
    'optional': true,
    'autoform': {
      omit: true
    }
  },

  createdAt: {
    'type': Date,
    'optional': true,
    'autoform': {
      omit: true
    }
  }
}

PostSchema = new SimpleSchema(postFields);
