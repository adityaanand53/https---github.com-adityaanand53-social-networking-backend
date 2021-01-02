"use strict";
const { sanitizeEntity } = require("strapi-utils");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


//login post request
const login = async (ctx) => {
  try {
    const entityByEmail = await strapi.services.users.findOne({
      email: ctx.request.body.email,
    });

    if (!entityByEmail) {
      return ctx.send({ message: "Incorrect username or password" });
    }

    const saltedPassword = entityByEmail.password;

    const successResult = await bcrypt.compare(
      ctx.request.body.password,
      saltedPassword
    );
    if (successResult === true) {
      const token = jwt.sign(
        { username: entityByEmail.username, id: entityByEmail.id },
        process.env.SECRET,
        {
          expiresIn: 86400, // expires in 24 hours
        }
      );
      return ctx.send({
        success: "Logged in successfully!",
        username: entityByEmail.username,
        id: entityByEmail.id,
        token,
      });
    } else {
      return ctx.send({ message: "Incorrect username or password" });
    }
  } catch (ex) {
    console.error(ex);
    return ctx.send(
      {
        message: "Something went wrong. Please try after some time.",
      },
      500
    );
  }
};

//register post request
const register = async (ctx) => {
  try {
    //check if user exist
    const entityByEmail = await strapi.services.users.findOne({
      email: ctx.request.body.email,
    });

    if (entityByEmail && Object.keys(entityByEmail).length) {
      return ctx.send({ message: "Email Id already exists." }, 409);
    }
    const entityByUserName = await strapi.services.users.findOne({
      username: ctx.request.body.username,
    });

    if (entityByUserName && Object.keys(entityByUserName).length) {
      return ctx.send({ message: "Username already exists." }, 409);
    }

    //the hash has the salt
    const hash = await bcrypt.hash(ctx.request.body.password, 10);
    await strapi.services.users.create({
      name: ctx.request.body.name,
      username: ctx.request.body.username,
      password: hash,
      email: ctx.request.body.email,
    });

    return ctx.send({ success: "User created successfully" });
  } catch (err) {
    return ctx.send(
      {
        message: "Something went wrong. Please try after some time.",
      },
      500
    );
  }
};

const posts = async (ctx) => {
  try {
    const _start = ctx.query.start;
    const relatedUsers = await getRelatedUsers(ctx);

    const allPosts = await strapi.services.posts.find({
      "user.id_in":
        relatedUsers && relatedUsers.length ? relatedUsers : ctx.user.id,
      _sort: "created_at:desc",
      _limit: 5,
      _start,
    });

    return ctx.send(
      allPosts.map((post) =>
        sanitizeEntity(post, { model: strapi.models.posts })
      )
    );
  } catch (err) {
    return ctx.send(
      {
        message: "Something went wrong. Please try after some time.",
      },
      500
    );
  }
};

const suggestions = async (ctx) => {
  try {
    const relatedUsers = await getRelatedUsers(ctx);
    const friendSuggestions = await strapi.services.users.find({
      id_nin: relatedUsers,
      _limit: 20,
    });

    return ctx.send(
      friendSuggestions.map((user) => {
        return {
          id: user.id,
          name: user.name,
          username: user.username,
        };
      })
    );
  } catch (err) {
    return ctx.send(
      {
        message: "Something went wrong. Please try after some time.",
      },
      500
    );
  }
};

const getFriends = async (ctx) => {
  try {
    return await strapi.services.friends.find({
      _where: {
        _or: [{ ["user_a.id"]: ctx.user.id }, { ["user_b.id"]: ctx.user.id }],
      },
    });
  } catch (err) {}
};

const getRelatedUsers = async (ctx) => {
  try {
    const allFriends = await getFriends(ctx);
    const relatedUsers = [
      ...new Set([
        ...allFriends.map((d) => d.user_a.id),
        ...allFriends.map((d) => d.user_b.id),
      ]),
    ];
    return relatedUsers;
  } catch (err) {
    throw new Error(err);
  }
};

const getfriendsList = async (ctx) => {
  try {
    const userId = ctx.user.id;
    const allFriends = await getFriends(ctx);
    let friendsList = [];
    if (allFriends && allFriends.length) {
      friendsList = allFriends.map((friendObj) => {
        if (friendObj.user_a.id === userId) {
          return { ...friendObj.user_b, friendId: friendObj.id };
        } else {
          return { ...friendObj.user_a, friendId: friendObj.id };
        }
      });
    }

    // if (relatedUsers && relatedUsers.length) {
    //   friendsList = relatedUsers.filter((user) => user.id !== ctx.user.id);
    // }

    return ctx.send(
      friendsList.map((friend) =>
        sanitizeEntity(friend, { model: strapi.models.users })
      )
    );
  } catch (err) {
    return ctx.send(
      {
        message: "Something went wrong. Please try after some time.",
      },
      500
    );
  }
};

module.exports = {
  login,
  register,
  posts,
  suggestions,
  getfriendsList,
};
