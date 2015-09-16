Meteor.publish('public_posts', function() {
  return Posts.find({ ipAddress: this.connection.clientAddress, password: { $exists: false } }, { fields: { ipAddress: 0 } });
});

Meteor.publish('locked_posts', function() {
  return Posts.find({ ipAddress: this.connection.clientAddress, password: { $exists: true } }, { fields: { createdAt: 1, userColor: 1 } });
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

Meteor.publish('user_color', function(requestedColorId, userColorAssignedAt) {
  var self = this,
      now = new Date().getTime(),
      clientIP = self.connection.clientAddress,
      requestedColorId = parseInt(requestedColorId),
      userColorAssignedAt = parseInt(userColorAssignedAt)

  function returnColor(colorId) {
    var color = Colors.findOne({ colorId: colorId }, { fields: { _id: 0 } });
    color.lastAssignedAt = now;
    self.added('color_assignments', color._id, color);
    self.ready();
  }

  if (requestedColorId != null && userColorAssignedAt) {
    var colorAssignment = ColorAssignments.findOne({ colorId: requestedColorId, lastAssignedAt: userColorAssignedAt, ipAddress: clientIP });

    if (colorAssignment) {
      ColorAssignments.update(colorAssignment._id, { $set: { lastAssignedAt: now } })
      returnColor(requestedColorId);
      return;
    }
  }

  var nextColorId = Meteor.call('getNextColor', clientIP);
  var upsert = ColorAssignments.upsert({ colorId: nextColorId, ipAddress: clientIP }, { $set: { lastAssignedAt: now } });

  returnColor(nextColorId);
  return;
});
