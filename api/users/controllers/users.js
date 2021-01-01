"use strict";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */
//login post request
const login = async (ctx) => {
  try {
    const entityByEmail = await strapi.services.users.findOne({
      email: ctx.request.body.email,
    });

    if (!entityByEmail) {
      ctx.send({ error: "Incorrect username or password" });
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
      ctx.send({
        success: "Logged in successfully!",
        username: entityByEmail.username,
        id: entityByEmail.id,
        token,
      });
    } else {
      ctx.send({ error: "Incorrect username or password" });
    }
  } catch (ex) {
    console.error(ex);
  }
};

//register post request
const register = async (ctx) => {
  //check if user exist

  const entityByEmail = await strapi.services.users.findOne({
    email: ctx.request.body.email,
  });
  console.log(entityByEmail);
  if (entityByEmail) {
    ctx.send({ error: "Email Id already exists." });
  }
  const entityByUserName = await strapi.services.users.findOne({
    username: ctx.request.body.username,
  });
  if (entityByUserName) {
    ctx.send({ error: "Username already exists." });
  }
  //the hash has the salt
  const hash = await bcrypt.hash(ctx.request.body.password, 10);
  await strapi.services.users.create({
    name: ctx.request.body.name,
    username: ctx.request.body.username,
    password: hash,
    email: ctx.request.body.email,
  });

  ctx.send({ success: "User created successfully" });
};

const posts = async (ctx) => {
  // console.log("query", JSON.stringify(ctx.user));

  const entityByUserId = await strapi.services.users.findOne({
    id: ctx.user.id,
  });

  const userids = [
    ctx.user.id,
    ...(entityByUserId.friends && entityByUserId.friends.length
      ? entityByUserId.friends
      : []),
  ];

  const allPosts = await strapi.services.posts.find({
    "user.id_in": userids,
    _sort: "created_at:desc",
  });

  ctx.send(allPosts);
};

const find = async (ctx) => {
  // console.log("query", JSON.stringify(ctx.user));

  // const entityByUserId = await strapi.services.users.findOne({
  //   id: ctx.user.id,
  // });
  const allFriends = await strapi.services.friends.find({
    _where: {
      _or: [{ ["user_a.id"]: ctx.user.id }, { ["user_b.id"]: ctx.user.id }],
    },
  });
  const relatedUsers = [...allFriends.map((d) => d.user_a.id), ...allFriends.map((d) => d.user_b.id)];
  console.log(relatedUsers);
  const friendSuggestions = await strapi.services.users.find({
    id_nin: relatedUsers,
    _limit: 20,
  });

  ctx.send(
    friendSuggestions.map((user) => {
      return {
        id: user.id,
        name: user.name,
        username: user.username,
      };
    })
  );
};

module.exports = {
  login,
  register,
  posts,
  find,
};
