"use strict"

const sgMail = require("@sendgrid/mail")

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

function sendAnEmail(recipient, sender, subject, text) {
    const msg = {
        to: recipient,
        from: sender,
        subject: subject,
        text: text,
        html: `<strong>${text}</strong>`,
    }
    sgMail.send(msg)
}

module.exports = {
    sendAnEmail
}