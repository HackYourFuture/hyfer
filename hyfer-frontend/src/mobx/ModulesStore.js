import { observable, action, runInAction } from 'mobx';
import { fetchJSON, API_BASE_URL } from './util';
import stores from '.';

export default class ModulesStore {

  @observable
  modules = [];

  @observable
  isChanged = false;

  serverModules = [];

  resetModules() {
    this.modules = [...this.serverModules];
    this.isChanged = false;
  }

  @action.bound
  async initModules() {
    try {
      this.serverModules = await fetchJSON('/modules');
      runInAction(() => this.resetModules());
    } catch (error) {
      stores.global.setLastError(error);
    }
  }

  @action.bound
  setModules(new_modules) {
    this.isChanged = true;
    this.modules = new_modules;
  }

  @action.bound
  undoChanges() {
    this.resetModules();
  }

  @action.bound
  addModule(module) {
    this.setModules([...this.modules, module]);
  }

  @action.bound
  updateModule(module) {
    const modules = this.modules.map(m => m.id === module.id ? module : m);
    this.setModules(modules);
  }

  @action.bound
  deleteModule(module) {
    const modules = this.modules.filter(m => m.id !== module.id);
    this.setModules(modules);
  }

  @action.bound
  async saveChanges() {
    try {
      await this.saveModules();
      this.initModules();
    } catch (error) {
      stores.global.setLastError(error);
    }
  }

  async saveModules() {
    const token = localStorage.getItem('token');
    return fetch(`${API_BASE_URL}/modules`, {
      method: 'PATCH',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(this.modules),
    });
  }
}
