const { sanitizeEntity } = require("strapi-utils");

const { getRelatedUsers } = require("./common");

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

module.exports = {
  posts,
};
