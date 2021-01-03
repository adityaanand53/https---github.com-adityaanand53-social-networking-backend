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

module.exports = {
  getRelatedUsers,
  getFriends
};
