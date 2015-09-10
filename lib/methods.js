Meteor.methods({
  submitPost: function(post) {
    if (Meteor.isServer) {
      post.ipAddress = this.connection.clientAddress;
    } else {
      Meteor.recentPostSentByUser = true;
    }

    if (post.body.text)
      post.body.text = mySanitizeHtml(post.body.text);
    post.createdAt = new Date();
    post._id = Posts.insert(post);

    return post;
  },

  removePost: function(post) {
    if (post.body.file) { // Only posts with files may be deleted
      Posts.remove(post);
    }
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
