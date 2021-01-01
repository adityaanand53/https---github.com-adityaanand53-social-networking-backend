const jwt = require("jsonwebtoken");

module.exports = async (ctx, next) => {
  try {
    const token = ctx.request.headers["x-access-token"];
    const result = await jwt.verify(token, process.env.SECRET);
    if (result) {
      ctx.user = result;
      return await next(result);
    }

    // return ctx.unauthorized(`You're not allowed to perform this action!`);
  } catch (err) {
    console.log(err);
    ctx.unauthorized(`You're not allowed to perform this action!`);
  }
};
