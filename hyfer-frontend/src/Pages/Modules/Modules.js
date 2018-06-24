import React, { Component } from 'react';
import ModuleHeader from './ModuleHeader';
import ModuleList from './ModuleList';
import ModuleFooter from './ModuleFooter';
// import ModuleObservable from './ModuleObservable';
import ModuleServiceBack from './ModuleServiceBack';
import style from '../../assets/styles/modules.css';
import { inject, observer } from 'mobx-react';

@inject('modulesStore')
@observer
export default class Modules extends Component {

  componentDidMount(){
    ModuleServiceBack.loadModules(result => {
      this.props.modulesStore.initModules(result);
    });
  }

  render() {
    const modulesArr = this.props.modulesStore.modules;
    const currentModules = modulesArr.slice();
    return (
      <div className={style.moduleContainer}>
        <ModuleHeader modules = {currentModules}/>
        <ModuleList modules = {currentModules}/>
        <ModuleFooter modules = {currentModules} />
        <div>
          <p>* Optional modules</p>
        </div>
      </div>
    );
  }
}
