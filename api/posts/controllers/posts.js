"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const updateLike = async (ctx) => {
  console.log(ctx.params);
  const post = await strapi.services.posts.findOne({
    id: ctx.params.id,
  });
  const likedByUserId = Number(ctx.params.likedById);
  if (!post.likedBy) {
    post.likedBy = {};
  }
  if (post.likedBy[likedByUserId]) {
    post.likedBy[likedByUserId] = false;
  } else {
    post.likedBy[likedByUserId] = true;
  }
  const result = await strapi.services.posts.update(
    { id: ctx.params.id },
    {
      likedBy: post.likedBy,
    }
  );
  console.log(result);
  ctx.send({ success: true, data: result });
};

module.exports = {
  updateLike,
};
