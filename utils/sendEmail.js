const SibApiV3Sdk = require("sib-api-v3-sdk");

const defaultClient = SibApiV3Sdk.ApiClient.instance;

const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.SIB_API_KEY;

const sendEmail = async ({ to, subject, html }) => {
  const transEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();
  const sender = {
    email: "basharatdar52@gmail.com",
  };
  try {
    await transEmailApi.sendTransacEmail({
      sender,
      to,
      subject,
      textContent: html,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendEmail;
