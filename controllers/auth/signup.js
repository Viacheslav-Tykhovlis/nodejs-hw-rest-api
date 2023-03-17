const { User } = require("../../models");
const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");
const { v4: uuidv4 } = require("uuid");

const { sendEmail } = require("../../helpers/sendEmail");

const signup = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user) {
    throw res
      .status(409)
      .json({ status: "error", code: 409, data: { message: "Email in use" } });
  }
  const avatarURL = gravatar.url(email);
  const hachPassword = await bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  const verificationToken = uuidv4();

  await User.create({
    email,
    password: hachPassword,
    subscription: "starter",
    avatar: avatarURL,
    verificationToken,
  });

  const mail = {
    to: email,
    subject: "Подтверждение  email",
    html: `<a target="_blanc" href="http://localhost:3000/api/users/verify/:${verificationToken}">Подтвердите email<a/>`,
  };

  await sendEmail(mail);

  return res.status(201).json({
    status: "success",
    code: 201,
    data: {
      user: {
        email,
        subscription: "starter",
        avatarURL,
        verificationToken,
      },
    },
  });
};

module.exports = signup;
