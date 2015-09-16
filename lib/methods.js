Meteor.methods({
  submitPost: function(post) {
    
    if (!post.colorAssignment)
      throw new Meteor.Error('wrong_user_color', 'The color assignment is missing');    

    var colorAssignment = post.colorAssignment;
    delete post.colorAssignment;    

    if (Meteor.isServer) {

      var clientIP = this.connection.clientAddress;
      post.ipAddress = clientIP

      var colorAssignmentIsValid = ColorAssignments.find({ 
        colorId: colorAssignment.colorId, 
        lastAssignedAt: colorAssignment.lastAssignedAt, 
        ipAddress: clientIP 
      }).count() > 0;

      if (!colorAssignmentIsValid)
        throw new Meteor.Error('wrong_user_color', 'The color assignment is wrong');    

      post.userColor = Colors.findOne({ colorId: colorAssignment.colorId }).hexCode;

    } else {

      Meteor.recentPostSentByUser = true;
      post.userColor = colorAssignment.hexCode;

    }

    if (post.body.text)
      post.body.text = mySanitizeHtml(post.body.text);

    if (post.password)
      post.password = SHA256(post.password);

    post.createdAt = new Date();
    post._id = Posts.insert(post);

    return post;
  },

  removePost: function(post) {
    if (post.body.file) { // Only posts with files may be deleted
      Posts.remove(post);
    }
  },

  getNextColor: function(clientIP) {
    if (Meteor.isClient) 
      return null;

    var numColors = 26; // Remember to change this when adding/removing a color. Currently hardcoding it cause it I don't want to access the DB for a static value for now
    var lastColorAssignment = ColorAssignments.findOne({ ipAddress: clientIP }, { sort: { lastAssignedAt: -1 } });
    return lastColorAssignment ? (lastColorAssignment.colorId + 1) % numColors : 0;
  }
});


function mySanitizeHtml(str) {
  str = lineBreaksToHtml(str);
  str = Autolinker.link(str);

  return sanitizeHtml(str, {
    allowedTags: ['b', 'i', 'em', 'strong', 'a', 'br'],
    allowedAttributes: {
      'a': ['href', 'target']
    }
  });
}

function lineBreaksToHtml(str) {
  return !str ? "" : str.replace(/(\r\n|\n|\r)/gm, '<br/>');
}
