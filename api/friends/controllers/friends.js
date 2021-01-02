"use strict";
const { sanitizeEntity } = require("strapi-utils");

const create = async (ctx) => {
  try {
    const result = await strapi.services.friends.create({
      user_a: ctx.user.id,
      user_b: ctx.params.freindUserId,
    });
    const friendObj = {
      ...result,
      user_a: sanitizeEntity(result.user_a, { model: strapi.models.users }),
      user_b: sanitizeEntity(result.user_b, { model: strapi.models.users }),
    };
    return ctx.send({ data: friendObj, success: true });
  } catch (err) {
    return ctx.send(
      {
        message: "Something went wrong. Please try after some time.",
      },
      500
    );
  }
};

const search = async (ctx) => {
  try {
    const allFriends = await strapi.services.friends.find({
      _where: {
        _or: [{ ["user_a.id"]: ctx.user.id }, { ["user_b.id"]: ctx.user.id }],
      },
    });
    const relatedUsers = [
      ...allFriends.map((d) => d.user_a.id),
      ...allFriends.map((d) => d.user_b.id),
    ];
    const query = ctx.params.q !== "~" ? ctx.params.q : "";
    const friendSuggestions = await strapi.services.users.find({
      id_nin: relatedUsers,
      name_contains: query,
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

module.exports = {
  create,
  search,
};
