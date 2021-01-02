"use strict";

const updateLike = async (ctx) => {
  try {
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
    return ctx.send({ success: true, data: result });
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
  updateLike,
};
