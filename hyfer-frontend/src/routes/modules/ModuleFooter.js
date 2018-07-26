import React, { Component } from 'react';
import PropTypes from 'prop-types';
import style from './modules.css';
import ModuleButton from './ModuleButton';
import ModuleForm from './ModuleForm';
import { inject, observer } from 'mobx-react';

@inject('modulesStore', 'notification')
@observer
export default class ModuleFooter extends Component {

  state = {
    modalVisible: false,
  }

  saveChanges = (modules) => {
    this.props.modulesStore.saveChanges(modules);
    this.props.notification.setSuccessMessage('Your changes have been successfully saved.');
  }

  undoChanges = () => {
    const { modulesStore, notification } = this.props;
    modulesStore.undoChanges();
    notification.setWarningMessage('Your changes have been cancelled.');
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
  modulesStore: PropTypes.object.isRequired,
  notification: PropTypes.object.isRequired,
};
