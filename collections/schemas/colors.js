var colorFields = {
  _id: {
    'type': String,
    'optional': true,
  },

  colorId: {
    'type': Number
  },

  hexCode: {
    'type': String
  }
}

ColorSchema = new SimpleSchema(colorFields);
