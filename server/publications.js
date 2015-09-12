Meteor.publish('public_posts', function() {
  return Posts.find({ ipAddress: this.connection.clientAddress, password: { $exists: false } }, { fields: { ipAddress: 0 } });
});

Meteor.publish('locked_posts', function() {
  return Posts.find({ ipAddress: this.connection.clientAddress, password: { $exists: true } }, { fields: { createdAt: 1 } });
});

Meteor.publish('unlocked_post', function(id, password) {
  return Posts.find({ _id: id, password: password });
});
