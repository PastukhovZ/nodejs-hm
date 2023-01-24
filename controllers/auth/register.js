const { Conflict } = require("http-errors");
const gravatar = require("gravatar");
const { uuid } = require("uuid");

const { sendEmail } = require("../../helpers");
const { User } = require("../../models");

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw new Conflict(`User with ${email} already exist`);
  }
  const verificationToken = uuid();
  const avatarURL = gravatar.url(email);
  const newUser = new User({ name, email, verificationToken });
  newUser.setPassword(password);
  newUser.save();

  const mail = {
    to: email,
    subject: "Подтверждения email",
    html: `<a target="_blank" href="http://localhost:3000/api/users/verify/${verificationToken}">Подтвердить email</a>`,
  };

  await sendEmail(mail);
  res.status(201).json({
    status: "success",
    code: 201,
    data: {
      user: {
        email,
        password,
        avatarURL,
      },
    },
  });
};

module.exports = register;
