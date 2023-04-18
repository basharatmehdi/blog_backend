const sendEmail = require("./sendEmail");
const sendResetPasswordEmail = async ({
  name,
  email,
  resetPasswordToken,
  origin,
}) => {
  const receivers = [
    {
      email: email,
    },
  ];

  return await sendEmail({
    to: receivers,
    subject: "Reset Your Password.",
    html: `
    Hello <b>${name}</b>
    <h2>Coding Byte </h2>
    <a href= "${origin}/reset-password?token=${resetPasswordToken}}">Click Here</a> to verify your email.
    `,
  });
};

module.exports = sendResetPasswordEmail;
