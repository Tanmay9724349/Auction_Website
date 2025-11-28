import nodeMailer from "nodemailer";

export const sendEmail = async ({ email, subject, message }) => {
  const transporter = nodeMailer.createTransport({
    host:"smtp.gmail.com",
    port:"465",
    service:"gmail",
    auth: {
      user:"ruchitbavarva3940@gmail.com",
      pass:"sujl wymg evft nxtf",
    },
  });
  const options = {
    from:"ruchitbavarva3940@gmail.com",
    to: email,
    subject: subject,
    text: message,
  };
  await transporter.sendMail(options);
};
