export const API_BASE_URL = 'http://localhost:3005/api';

export async function fetchJSON(path) {
  const headers = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = 'Bearer ' + token;
  }
  const res = await fetch(API_BASE_URL + path, { method: 'GET', headers });
  return res.json();
}
