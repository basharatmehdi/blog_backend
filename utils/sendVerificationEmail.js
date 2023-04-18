const sendEmail = require("./sendEmail");
const sendVerificationEmail = async ({
  name,
  email,
  verificationToken,
  origin,
}) => {
  const receivers = [
    {
      email: email,
    },
  ];

  return await sendEmail({
    to: receivers,
    subject: "Verify Your Email.",
    html: `
    Hello <b>${name}</b>
    <h2>Coding Byte </h2>
    <a href= "${origin}/verify-email?token=${verificationToken}}">Click Here</a> to verify your email.
    `,
  });
};

module.exports = sendVerificationEmail;
