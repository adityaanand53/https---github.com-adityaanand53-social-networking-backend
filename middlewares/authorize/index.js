const jwt = require('jsonwebtoken');
module.exports = (strapi) => {
  return {
    initialize() {
      strapi.app.use(async (ctx, next) => {
        const token = ctx.request.headers["x-access-token"];
        console.log(token);

        jwt.verify(token, process.env.SECRET, (err, decoded) => {
          if (err)
            return ctx.send({
              auth: false,
              message: "Failed to authenticate token.",
            });
          next();
        });
      });
    },
  };
};
