Meteor.methods({
  submitPost: function(post) {
    if (Meteor.isServer)
      post.ipAddress = this.connection.clientAddress;
    else
      Meteor.recentPostSentByUser = true;

    post.createdAt = new Date();
    post._id = Posts.insert(post);

    return post;
  }
});
