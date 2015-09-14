Meteor.publish('public_posts', function() {
  return Posts.find({ ipAddress: this.connection.clientAddress, password: { $exists: false } }, { fields: { ipAddress: 0 } });
});

Meteor.publish('locked_posts', function() {
  return Posts.find({ ipAddress: this.connection.clientAddress, password: { $exists: true } }, { fields: { createdAt: 1 } });
});

Meteor.publish('unlocked_post', function(id, password) {
  if (!password)
    return null;

  password = SHA256(password);
  var post = Posts.find({ _id: id, password: password });

  if (post.count() == 0)
    this.error(new Meteor.Error('wrong_password', 'The inputted password is wrong.'));
  else
    return post;
});
