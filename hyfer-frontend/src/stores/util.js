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

  const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}${path}`, options);

  if (res.status === 200) {
    return await res.json();
  }

  if (res.status >= 400) {
    const result = await res.json();
    throw new Error(result.message || result.sqlMessage || 'Unexpected server error.');
  }

  return undefined;
}
