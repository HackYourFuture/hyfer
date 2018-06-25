import { API_BASE_URL } from '.';

function createHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = 'Bearer ' + token;
  }
  return headers;
}

export async function fetchJSON(path) {
  const headers = createHeaders();
  const res = await fetch(API_BASE_URL + path, {
    method: 'GET',
    headers,
  });
  return res.json();
}

export async function patchJSON(path, data) {
  const headers = createHeaders();
  const res = await fetch(API_BASE_URL + path, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(data),
  });
  return res.json();
}

