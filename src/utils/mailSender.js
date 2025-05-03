const nodemailer = require("nodemailer");


async function mailSender(email, subject, html) {

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        auth: {
            user: process.env.MAIL,
            pass: process.env.PASSWORD
        }
    });


    const info = await transporter.sendMail({
        from: `"Team Eduauraa" <${process.env.MAIL}>`,
        to: `${email}`,
        cc: `${process.env.CC_MAIL}`, 
        // bcc: `${bcc}`, 
        subject: subject,
        html: html,
      });

}


module.exports = mailSender;


