const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function sendAnEmail(req, res) {
  const {
    recipient,
    sender,
    subject,
    text,
  } = req.body;
  const msg = {
    to: recipient,
    from: sender,
    subject,
    text,
    html: `<strong>${text}</strong>`,
  };
  sgMail
    .send(msg)
    .then(() => res.sendStatus(204))
    .catch(err => res.status(500).json(err));
}

module.exports = {
  sendAnEmail,
};
