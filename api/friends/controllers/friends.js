"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const create = async (ctx) => {
  const result = await strapi.services.friends.create({
    user_a: ctx.user.id,
    user_b: ctx.params.freindUserId,
  });

  ctx.send({ data: result, success: true });
};

const search = async (ctx) => {
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
  console.log(ctx.user.id);
  const friendSuggestions = await strapi.services.users.find({
    id_nin: relatedUsers,
    name_contains: query,
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
  create,
  search,
};
