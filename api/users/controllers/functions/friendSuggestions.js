const { getRelatedUsers } = require("./common");

const suggestions = async (ctx) => {
  try {
    // get all friends
    const relatedUsers = await getRelatedUsers(ctx);

    // filter friends
    const friendSuggestions = await strapi.services.users.find({
      id_nin: [...relatedUsers, ctx.user.id],
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
  suggestions,
};
