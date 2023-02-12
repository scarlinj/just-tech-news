const User = require('./User');
const Post = require('./Post');
const Vote = require('./Vote');
const Comment = require('./Comment');

// create associations
// With the below two .belongsToMany() methods in place, we're allowing both the User and Post models to query each other's information in the context of a vote. 
// If we want to see which users voted on a single post, we can now do that. If we want to see which posts a single user voted on, we can see that too. 
// This makes the data more robust and gives us more capabilities for visualizing this data on the client-side.

User.hasMany(Post, {
  foreignKey: 'user_id'
});

Post.belongsTo(User, {
  foreignKey: 'user_id',
});

User.belongsToMany(Post, {
    through: Vote,
    as: 'voted_posts',
  foreignKey: 'user_id'
});
  
Post.belongsToMany(User, {
    through: Vote,
    as: 'voted_posts',
  foreignKey: 'post_id'
});

Vote.belongsTo(User, {
  foreignKey: 'user_id'
});
  
Vote.belongsTo(Post, {
  foreignKey: 'post_id'
});
  
User.hasMany(Vote, {
  foreignKey: 'user_id'
});
  
Post.hasMany(Vote, {
  foreignKey: 'post_id'
});

Comment.belongsTo(User, {
  foreignKey: 'user_id'
});

Comment.belongsTo(Post, {
  foreignKey: 'post_id'
});

User.hasMany(Comment, {
  foreignKey: 'user_id'
});

Post.hasMany(Comment, {
  foreignKey: 'post_id'
});

// export the user model as an object
module.exports = {
  User,
  Post,
  Vote,
  Comment
};