Meteor.publish('posts', function() {
  return Posts.find({ ipAddress: this.connection.clientAddress });
});
