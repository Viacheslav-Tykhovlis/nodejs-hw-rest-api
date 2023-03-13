const { NotFound, BadRequest } = require("http-errors");
const { User } = require("../../models");
const { sendEmail } = require("../../helpers");
const { verifyEmailSchema } = require("../../models/user");

const resendVerifyEmail = async (req, res) => {
  const { error } = verifyEmailSchema.validate(req.body);
  if (error) {
    error.status = 400;
    error.message = "missing required field email";
    throw error;
  }

  const { email } = req.body;
  const user = User.findOne({ email });

  if (!user) {
    throw NotFound();
  }

  if (user.verify) {
    throw BadRequest();
  }

  const mail = {
    to: email,
    subject: "Подтверждение  email",
    html: `<a target="_blanc" href="http://localhost:3000/api/users/verify/:${user.verificationToken}">Подтвердите email<a/>`,
  };

  await sendEmail(mail);
  res.json({
    message: "Email verify resend",
  });
};

module.exports = resendVerifyEmail;
