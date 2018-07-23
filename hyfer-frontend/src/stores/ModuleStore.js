import { observable, action, runInAction } from 'mobx';
import { fetchJSON } from './util';
import stores from '.';

export default class ModuleStore {

  @observable
  modules = [];

  @observable
  isChanged = false;

  serverModules = [];

  async getModules() {
    try {
      this.serverModules = await fetchJSON('/api/modules');
      runInAction(() => this.setModules(this.serverModules, false));
    } catch (error) {
      stores.uiStore.setLastError(error);
    }
  }

  @action
  setModules = (modules, isChanged = true) => {
    this.modules = [...modules];
    this.isChanged = isChanged;
  }

  addModule = (module) => this.setModules([...this.modules, module]);

  updateModule = (module) => {
    const modules = this.modules.map(m => m.id === module.id ? module : m);
    this.setModules(modules);
  }

  deleteModule = (module) => {
    const modules = this.modules.filter(m => m.id !== module.id);
    this.setModules(modules);
  }

  saveChanges = async () => {
    try {
      await fetchJSON('/api/modules', 'PATCH', this.modules);
      this.getModules();
    } catch (error) {
      stores.uiStore.setLastError(error);
    }
  }

  undoChanges = () => this.setModules(this.serverModules, false);
}
