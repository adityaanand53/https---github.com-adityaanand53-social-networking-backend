const { sanitizeEntity } = require("strapi-utils");

const { getFriends } = require("./common");

const getfriendsList = async (ctx) => {
  try {
    const userId = ctx.user.id;

    // get all friends
    const allFriends = await getFriends(ctx);
    let friendsList = [];

    // adding friendId from friends table
    if (allFriends && allFriends.length) {
      friendsList = allFriends.map((friendObj) => {
        if (friendObj.user_a.id === userId) {
          return { ...friendObj.user_b, friendId: friendObj.id };
        } else {
          return { ...friendObj.user_a, friendId: friendObj.id };
        }
      });
    }

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
  getfriendsList,
};
