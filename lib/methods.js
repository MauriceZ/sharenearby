Meteor.methods({
  submitPost: function(post) {
    if (Meteor.isServer) {
      post.ipAddress = this.connection.clientAddress;
    } else {
      Meteor.recentPostSentByUser = true;
    }

    post.body = mySanitizeHtml(post.body);
    post.createdAt = new Date();
    post._id = Posts.insert(post);

    return post;
  }
});

function mySanitizeHtml(str) {
  str = Autolinker.link(str);

  return sanitizeHtml(str, {
    allowedTags: ['b', 'i', 'em', 'strong', 'a'],
    allowedAttributes: {
      'a': ['href', 'target']
    }
  });
}
