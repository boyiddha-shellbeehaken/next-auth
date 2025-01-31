import nodemailer from "nodemailer";
import User from "../models/userModel";
import bcryptjs from "bcryptjs";

export const sendEmail = async ({ email, emailType, userId }) => {
  try {
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    if (emailType === "VERIFY") {
      const newExpiryDate = new Date(Date.now() + 3600000); // 1hr
      await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            verifyToken: hashedToken,
            verifyTokenExpiry: newExpiryDate,
          },
        },
        { new: true } // ensure Return the updated document into DB
      );
    } else if (emailType === "RESET") {
      const newExpiryDate = new Date(Date.now() + 3600000); // 1hr
      await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            forgotPasswordToken: hashedToken,
            forgotPasswordTokenExpiry: newExpiryDate,
          },
        },
        { new: true } // ensure return the updated document into DB
      );
    }

    // Looking to send emails in production? Check out our Email API/SMTP product!
    var transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "756611946cbb6b",
        pass: "486a7bdaffc878",
      },
    });
    // send mail with defined transport object
    const mailOptions = {
      from: "boyiddha.shellbeehaken@gmail.com", // sender address
      to: email, // list of receivers
      subject:
        emailType === "VERIFY" ? "Verify your Email" : "Reset your password", // Subject line
      //text: "Hello world?", // plain text body
      html: `<p>Click <a href="${
        process.env.DOMAIN
      }/verifyemail?token=${hashedToken}">here</a> to ${
        emailType === "VERIFY" ? "verify your email" : "reset your password"
      }
      or copy and paste the link below in your browser.
      <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
      </p>`, // html body
    };

    const mailResponse = await transport.sendMail(mailOptions);
    return mailResponse;
  } catch (error) {
    throw new Error(error.message);
  }
};
