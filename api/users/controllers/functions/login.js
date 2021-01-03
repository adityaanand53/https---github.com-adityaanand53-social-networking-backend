const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (ctx) => {
  try {
    const entityByEmail = await strapi.services.users.findOne({
      email: ctx.request.body.email,
    });

    if (!entityByEmail) {
      return ctx.send({ message: "Incorrect username or password" });
    }

    const saltedPassword = entityByEmail.password;

    const successResult = await bcrypt.compare(
      ctx.request.body.password,
      saltedPassword
    );
    if (successResult === true) {
      const token = jwt.sign(
        { username: entityByEmail.username, id: entityByEmail.id },
        process.env.SECRET,
        {
          expiresIn: 86400, // expires in 24 hours
        }
      );
      return ctx.send({
        success: "Logged in successfully!",
        username: entityByEmail.username,
        id: entityByEmail.id,
        token,
      });
    } else {
      return ctx.send({ message: "Incorrect username or password" });
    }
  } catch (ex) {
    console.error(ex);
    return ctx.send(
      {
        message: "Something went wrong. Please try after some time.",
      },
      500
    );
  }
};


module.exports = {
  login
};
