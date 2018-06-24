import React, { Component } from 'react';
import style from '../../assets/styles/modules.css';
import ModuleButton from './ModuleButton';
import ModuleForm from './ModuleForm';
import { inject, observer } from 'mobx-react';

@inject('modulesStore')
@observer
export default class ModuleFooter extends Component {
  render() {
    const {
      isChanged,
      isAdding,
      UndoChanges,
      SaveChanges,
      showAddModal,
      hideAddModal,
      AddModule,
    } = this.props.modulesStore;

    return (
      <div className={style.moduleFooter}>
        <ModuleButton
          action="undo"
          title="Undo Changes"
          disabled={!isChanged}
          clickHandler={UndoChanges}
        />
        <span className={style.moduleButtonSep} />
        <ModuleButton
          action="save"
          title="Save Changes"
          disabled={!isChanged}
          clickHandler={SaveChanges}
        />
        <ModuleButton
          action="add"
          title="Add module"
          disabled={false}
          clickHandler={showAddModal}
        />
        <ModuleForm
          onCancel={hideAddModal}
          onAdd={AddModule}
          visible={isAdding}
          title="Adding Module.."
          actionName="ADD"
        />
      </div>
    );
  }
}
