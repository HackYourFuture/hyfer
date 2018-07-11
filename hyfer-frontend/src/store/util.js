const API_ROOT = process.env.REACT_APP_API_BASE_URL;

export async function fetchJSON(path) {
  const headers = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = 'Bearer ' + token;
  }
  const res = await fetch(API_ROOT + path, { method: 'GET', headers });
  if (!res.ok) {
    throw new Error(`${res.status} - ${res.statusText}`);
  }
  return res.json();
}
