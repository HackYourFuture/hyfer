import React, { Component } from 'react';
import style from '../../assets/styles/modules.css';
import ModuleButton from './ModuleButton';
import ModuleObservable from './ModuleObservable';
import ModuleServiceBack from './ModuleServiceBack';
import ModuleForm from './ModuleForm';
import { success, warning, errorMessage } from '../../notify';

export default class ModuleFooter extends Component {
  state = {
    isChanged: false,
    isAdding: false,
  };

  componentDidMount = () => {
    ModuleObservable.subscribe(() => {
      this.setState({ isChanged: ModuleObservable.isChanged() });
    });
  };

  UndoChanges = () => {
    ModuleObservable.resetModules();
    warning('Your changes have been cancelled !', 'warning');
  };

  SaveChanges = () => {
    try {
      ModuleServiceBack.saveModules(ModuleObservable.getModules(), () => {
        ModuleServiceBack.loadModules(result =>
          ModuleObservable.initModules(result)
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

  AddModule = module => {
    const curModulesArr = ModuleObservable.getModules();
    const newModulesArr = Array.from(curModulesArr);

    const maxId = curModulesArr
      .map(m => m.id)
      .reduce((max, cur) => Math.max(max, cur));
    module.id = maxId + 1;
    newModulesArr.push(module);

    ModuleObservable.setModules(newModulesArr);
  };

  showAddModal = () => {
    this.setState({
      isAdding: true,
    });
  };

  hideAddModal = () => {
    this.setState({
      isAdding: false,
    });
  };

  render() {
    return (
      <div className={style.moduleFooter}>
        <ModuleButton
          action="undo"
          title="Undo Changes"
          disabled={!this.state.isChanged}
          clickHandler={this.UndoChanges}
        />
        <span className={style.moduleButtonSep} />
        <ModuleButton
          action="save"
          title="Save Changes"
          disabled={!this.state.isChanged}
          clickHandler={this.SaveChanges}
        />
        <ModuleButton
          action="add"
          title="Add module"
          disabled={false}
          clickHandler={this.showAddModal}
        />
        <ModuleForm
          onCancel={this.hideAddModal}
          onAdd={this.AddModule}
          visible={this.state.isAdding}
          title="Adding Module.."
          actionName="ADD"
        />
      </div>
    );
  }
}
