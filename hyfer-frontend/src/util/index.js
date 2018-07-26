// import stores from '../stores';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const token = localStorage.getItem('token');

export async function sendAnEmail(recipient, sender, subject, text) {
  const body = {
    recipient,
    sender,
    subject,
    text,
  };
  const res = await fetch(`${BASE_URL}/api/sendEmail`, {
    method: 'POST',
    headers: {
      'Content-Type': 'Application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(res);
  // else stores.notification.setSuccessMessage('Email was sent successfully');
}

