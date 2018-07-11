export async function saveHistory(body) {
  const token = localStorage.getItem('token');
  const BASE_URL = `${process.env.REACT_APP_API_BASE_URL}/api/history`;

  const response = await fetch(BASE_URL, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
  });
  return response;
}
