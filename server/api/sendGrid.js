"use strict"

const sgMail = require("@sendgrid/mail")
const config = require("../config/config.js")

sgMail.setApiKey(config.SENDGRID_API_KEY)

function sendAnEmail(req, res) {
    const msg = {
        to: req.body.recipient,
        from: req.body.sender,
        subject: req.body.subject,
        text: req.body.text,
        html: `<strong>${req.body.text}</strong>`,
    }
    sgMail
        .send(msg)
        .then(() => {
            console.log("mail sent successfully")
            res.end()
        })
        .catch(err => console.log(res.statusCode ,err))
}

module.exports = {
    sendAnEmail
}