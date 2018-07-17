import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Resizable from 're-resizable';
import style from './modules.css';
import ModuleForm from './ModuleForm';
import { inject, observer } from 'mobx-react';

@inject('moduleStore')
@observer
export default class ModuleItem extends Component {
  state = {
    isMenuShow: false,
    isEditing: false,
  };

  showMenu = () => {
    this.setState({ isMenuShow: true });
  };

  hideMenu = () => {
    this.setState({ isMenuShow: false });
  };

  editModule = () => {
    this.setState({
      isMenuShow: false,
      isEditing: true,
    });
  };

  showAddModal = () => {
    this.setState({ isEditing: true });
  };

  hideAddModal = () => {
    this.setState({ isEditing: false });
  };

  deleteModule = () => {
    this.props.moduleStore.deleteModule(this.props.module);
  };

  updateModule = module => {
    const curModulesArr = this.props.moduleStore.modules;
    const newModulesArr = curModulesArr.map(a => {
      if (a.id === module.id) {
        return module;
      } else {
        return { ...a };
      }
    });
    this.props.moduleStore.setModules(newModulesArr);
  };

  render() {
    const module = this.props.module;
    const moduleWidth = module.default_duration * this.props.weekWidth;
    return (
      <div>
        <Resizable
          style={{ backgroundColor: module.color }}
          className={style.moduleItem}
          handleStyles={{
            right: {
              width: '4px',
              height: '80%',
              top: '10%',
              right: '0px',
              cursor: 'ew-resize',
              backgroundColor: 'gray',
              opacity: '0.8',
              borderRadius: '2px',
            },
          }}
          size={{ width: moduleWidth }}
          enable={{
            top: false,
            right: true,
            bottom: false,
            left: false,
            topRight: false,
            bottomRight: false,
            bottomLeft: false,
            topLeft: false,
          }}
          grid={[this.props.weekWidth, 1]}
          minWidth={this.props.weekWidth}
          maxWidth={this.props.weekWidth * 6}
          onResizeStop={(e, direction, ref, d) => {
            const newDuration = Math.round(d.width / this.props.weekWidth);
            const modules = this.props.moduleStore.modules;
            const newModules = modules.map(a => ({ ...a }));
            for (const m of newModules) {
              if (m.id === module.id) {
                m.default_duration += newDuration;
              }
            }
            this.props.moduleStore.setModules(newModules);
          }}
          onResizeStart={e => e.stopPropagation()}
        >
          <div className={style.moduleItemContent}>
            <md-icon class="material-icons" onClick={this.showMenu}>
              more_vert
            </md-icon>
            {module.module_name}
            {module.optional === 1 ? '*' : ''}
          </div>

          <ul
            onMouseDown={e => e.stopPropagation()}
            className={style.moduleMenu}
            style={{
              visibility: this.state.isMenuShow ? 'visible' : 'hidden',
              opacity: this.state.isMenuShow ? '1' : '0',
            }}
          >
            <li>
              <button style={{ color: '#3e43cc' }} onClick={this.editModule}>
                <md-icon class="material-icons">edit</md-icon>
                <span>Edit</span>
              </button>
            </li>
            <li className={style.menuSep} />
            <li>
              <button
                style={{ color: module.ref_count > 0 ? '' : '#FF5722' }}
                disabled={module.ref_count > 0 ? true : false}
                onClick={this.deleteModule}
              >
                <md-icon class="material-icons">delete</md-icon>
                <span>Delete</span>
              </button>
            </li>
          </ul>

          <div
            onMouseDown={this.hideMenu}
            className={style.menuOverlay}
            style={{ display: this.state.isMenuShow ? 'block' : 'none' }}
          />
        </Resizable>
        <ModuleForm
          onCancel={this.hideAddModal}
          onAdd={this.updateModule}
          visible={this.state.isEditing}
          title={'Update Module ' + this.props.module.module_name + '..'}
          module={this.props.module}
          actionName="UPDATE"
        />
      </div>
    );
  }
}

ModuleItem.wrappedComponent.propTypes = {
  module: PropTypes.object.isRequired,
  moduleStore: PropTypes.object.isRequired,
  weekWidth: PropTypes.number.isRequired,
};
