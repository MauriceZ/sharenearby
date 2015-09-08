var postFields = {
  _id: {
    'type': String,
    'optional': true,
    'autoform': {
      omit: true
    }
  },

  body: {
    type: Object
  },

  'body.text': {
    'type': String,
    'optional': true
  },

  'body.file': {
    'type': String,
    'optional': true
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
