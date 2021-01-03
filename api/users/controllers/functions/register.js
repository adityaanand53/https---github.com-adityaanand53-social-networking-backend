const bcrypt = require("bcrypt");

const register = async (ctx) => {
  try {
    //check if user exist
    const entityByEmail = await strapi.services.users.findOne({
      email: ctx.request.body.email,
    });

    if (entityByEmail && Object.keys(entityByEmail).length) {
      return ctx.send({ message: "Email Id already exists." }, 409);
    }
    const entityByUserName = await strapi.services.users.findOne({
      username: ctx.request.body.username,
    });

    if (entityByUserName && Object.keys(entityByUserName).length) {
      return ctx.send({ message: "Username already exists." }, 409);
    }

    //the hash has the salt
    const hash = await bcrypt.hash(ctx.request.body.password, 10);
    await strapi.services.users.create({
      name: ctx.request.body.name,
      username: ctx.request.body.username,
      password: hash,
      email: ctx.request.body.email,
    });

    return ctx.send({ success: "User created successfully" });
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
  register
};
