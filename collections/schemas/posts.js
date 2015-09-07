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
