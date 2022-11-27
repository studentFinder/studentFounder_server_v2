import nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';
import dotenv from 'dotenv';
dotenv.config()

var transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
        user: 'gmmoon0824@gmail.com',
        pass: process.env.GMAILPW
    }
}));



export async function sendCode(data) {
    const {email, code} = data;

    var mailOptions = {
        from: 'gmmoon0824@gmail.com',
        to: email,
        subject: 'Sending Email using Node.js[nodemailer]',
        text: "your code: "+code
    };

    transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        }
    )

    return true;
}