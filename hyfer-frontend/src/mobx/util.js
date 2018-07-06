export async function fetchJSON(path, method = 'GET', data = null) {
  const headers = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = 'Bearer ' + token;
  }
  const options = { method, headers };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api${path}`, options);
  return res.json();
}

