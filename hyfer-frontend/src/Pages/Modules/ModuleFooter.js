/* eslint react/prop-types: error */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import style from '../../assets/styles/modules.css';
import ModuleButton from './ModuleButton';
import ModuleForm from './ModuleForm';
import { inject, observer } from 'mobx-react';

@inject('modulesStore', 'global')
@observer
export default class ModuleFooter extends Component {

  state = {
    modalVisible: false,
  }

  saveChanges = (modules) => {
    const { modulesStore, global } = this.props;
    modulesStore.saveChanges(modules);
    global.setSuccessMessage('Your changes have been successfully saved!');
  }

  undoChanges = () => {
    const { modulesStore, global } = this.props;
    modulesStore.undoChanges();
    global.setWarningMessage('Your changes have been cancelled!');
  }

  render() {
    const { addModule, isChanged } = this.props.modulesStore;
    return (
      <div className={style.moduleFooter}>
        <ModuleButton
          action="undo"
          title="Undo Changes"
          disabled={!isChanged}
          clickHandler={this.undoChanges}
        />
        <span className={style.moduleButtonSep} />
        <ModuleButton
          action="save"
          title="Save Changes"
          disabled={!isChanged}
          clickHandler={this.saveChanges}
        />
        <ModuleButton
          action="add"
          title="Add module"
          disabled={false}
          clickHandler={() => this.setState({ modalVisible: true })}
        />
        <ModuleForm
          onCancel={() => this.setState({ modalVisible: false })}
          onAdd={addModule}
          visible={this.state.modalVisible}
          title="Adding Module..."
          actionName="ADD"
        />
      </div>
    );
  }
}

ModuleFooter.wrappedComponent.propTypes = {
  global: PropTypes.object.isRequired,
  modulesStore: PropTypes.object.isRequired,
};
