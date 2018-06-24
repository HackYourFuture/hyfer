import { observable, action } from 'mobx';
import { success, warning, errorMessage } from '../notify';
import ModuleServiceBack from '../Pages/Modules/ModuleServiceBack';
// const api_url = 'http://localhost:3000/api';
// const token = localStorage.getItem('token');

export default class ModulesStore {

  @observable
  modules = [];

  @observable
  serverModules = [];

  @observable
  weekWidth = 1;

  @observable
  isAdding = false;

  @observable
  isChanged = false;

  @observable
  isMenuShow = false;

  @observable
  isEditing = false;

  @action
  setModules = new_modules => {
    this.isChanged = true;
    this.modules = new_modules;
  };
  @action
  initModules = server_modules => {
    this.serverModules = server_modules;
    this.isChanged = false;
    this.modules = server_modules;
  };
  @action
  isChanged = () => {
    return this.isChanged;
  };
  @action
  resetModules = () => {
    this.initModules(this.serverModules);
  };
  @action
  computeWeekWidth = () => {
    const week_element = document.querySelector('.week_element');
    if (week_element != null) {
      this.weekWidth = week_element.clientWidth;
    }
  };
  @action
  reorder = (list, startIndex, endIndex) => {
    const result = list;
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };
  @action
  onDragEnd = result => {
    if (!result.destination) {
      return;
    }
    const items = this.reorder(
      this.modules,
      result.source.index,
      result.destination.index
    );
    this.setModules(items);
  };
  @action
  UndoChanges = () => {
    this.resetModules();
    warning('Your changes have been cancelled !', 'warning');
  };
  @action
  SaveChanges = () => {
    try {
      ModuleServiceBack.saveModules(this.modules, () => {
        ModuleServiceBack.loadModules(result =>
          this.initModules(result)
        );
        success('Your changes are successfully Saved !');
      });
    } catch (e) {
      // try catch because a small code and multiple unexpected errors
      // if nothing passed into errorMessage the default is:
      if (!e) errorMessage(/* Oops something went wrong */);
      else errorMessage(e); // if the user has a specific error
    }
  };
  @action
  AddModule = module => {
    const curModulesArr = this.modules;
    const newModulesArr = Array.from(curModulesArr);

    const maxId = curModulesArr
      .map(m => m.id)
      .reduce((max, cur) => Math.max(max, cur));
    module.id = maxId + 1;
    newModulesArr.push(module);

    this.setModules(newModulesArr);
  };
  @action
  showAddModal = () => {
    this.isAdding = true;
  };
  @action
  hideAddModal = () => {
    this.isAdding = false;
  };
  @action
  showMenu = () => {
    this.isMenuShow   = true;
  };
  @action
  hideMenu = () => {
    this.isMenuShow = false;
  };
  @action
  EditModule = () => {
    this.isMenuShow = false;
    this.isEditing = true;
  };

  @action
  hideAddModalItem = () => {
    this.isEditing = false;
  };
  @action
  DeleteModule = () => {
    const curModulesArr = this.modules;
    let newModulesArr = curModulesArr.map(a => ({ ...a }));
    newModulesArr = newModulesArr.filter(m => m.id !== this.props.module.id);
    this.setModules(newModulesArr);
  };
  @action
  UpdateModule = module => {
    const curModulesArr = this.modules;
    const newModulesArr = curModulesArr.map(a => {
      if (a.id === module.id) {
        return module;
      } else {
        return { ...a };
      }
    });
    this.setModules(newModulesArr);
  };
}
