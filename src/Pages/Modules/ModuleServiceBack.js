const api_url = 'http://localhost:3000/api';

class moduleServiceBack {
  loadModules(callBack) {
    const token = localStorage.getItem('token');
    fetch(`${api_url}/modules`, {
      credentials: 'same-origin',
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
      .then(res => res.json())
      .then(resJson => {
        callBack(resJson);
      })
      .catch(error => {
        console.log(error);
        throw new Error('Server error!');
      });
  }

  saveModules(modules, callBack) {
    const token = localStorage.getItem('token');
    fetch(`${api_url}/modules`, {
      method: 'PATCH',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      },
      body: JSON.stringify(modules)
    })
      .then(res => {
        callBack();
      })
      .catch(error => {
        console.log(error);
        throw new Error('Server error!');
      });
  }
}

var ModuleServiceBack = new moduleServiceBack();
export default ModuleServiceBack;
