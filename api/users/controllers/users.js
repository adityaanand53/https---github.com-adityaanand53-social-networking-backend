"use strict";

const { login } = require("./functions/login");
const { register } = require("./functions/register");
const { suggestions } = require("./functions/friendSuggestions");
const { getfriendsList } = require("./functions/getFriendList");
const { posts } = require("./functions/posts");

module.exports = {
  login,
  register,
  posts,
  suggestions,
  getfriendsList,
};
