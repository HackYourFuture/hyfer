import { observable, action, runInAction } from 'mobx';
import { fetchJSON, patchJSON } from './util';
import stores from '.';

export default class ModulesStore {

  @observable
  modules = [];

  @observable
  isChanged = false;

  serverModules = [];

  @action.bound
  async initModules() {
    try {
      this.serverModules = await fetchJSON('/modules');
      runInAction(() => this.setModules(this.serverModules, false));
    } catch (error) {
      stores.global.setLastError(error);
    }
  }

  @action.bound
  setModules(modules, isChanged = true) {
    this.modules = [...modules];
    this.isChanged = isChanged;
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
      await patchJSON('/modules', this.modules);
      this.initModules();
    } catch (error) {
      stores.global.setLastError(error);
    }
  }

  @action.bound
  undoChanges() {
    this.setModules(this.serverModules, false);
  }
}
