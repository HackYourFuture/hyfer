const api_url = 'http://localhost:3000/api';

class moduleServiceBack {
  async loadModules(callBack) {
    const token = localStorage.getItem('token');
    const res = await fetch(`${api_url}/modules`, {
      // credentials: 'same-origin',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });
    if (!res.ok) throw res;
    const resJson = await res.json();
    callBack(resJson);
  }

  async saveModules(modules, callBack) {
    console.log(modules);
    const token = localStorage.getItem('token');
    const res = await fetch(`${api_url}/modules`, {
      method: 'PATCH',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(modules),
    });
    if (!res.ok) throw res;
    await callBack();
  }
}

const ModuleServiceBack = new moduleServiceBack();
export default ModuleServiceBack;
