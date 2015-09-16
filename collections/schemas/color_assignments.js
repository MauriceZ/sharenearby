var colorAssignmentFields = {
  _id: {
    'type': String,
    'optional': true,
  },

  colorId: {
    'type': Number
  },

  ipAddress: {
    'type': String,
  },

  lastAssignedAt: {
    'type': Number,
  }
}

ColorAssignmentSchema = new SimpleSchema(colorAssignmentFields);
