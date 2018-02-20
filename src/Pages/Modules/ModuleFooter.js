import React, { Component } from 'react';
import style from  '../../assets/styles/modules.css';
import ModuleButton from './ModuleButton';
import ModuleObservable from './ModuleObservable';
import ModuleServiceBack from './ModuleServiceBack';
import ModuleForm from './ModuleForm';
//import { triggerAsyncId } from 'async_hooks';

export default class ModuleFooter extends Component {

  constructor(props) {
    super(props);
    this.state = {isChanged:false, isadding: false};
  }

  componentDidMount = () => {
    ModuleObservable.subscribe((newArr) => {
				this.setState({isChanged: ModuleObservable.isChanged()})
    })
  };

  UndoChanges = () => {
    ModuleObservable.resetModules()
  }

  SaveChanges = () => {
    ModuleServiceBack.saveModules(ModuleObservable.getModules() , ()=> {
      ModuleServiceBack.loadModules((result)=> ModuleObservable.initModules(result))
    })
  }

  AddModule = (module) =>{
    const curModulesArr = ModuleObservable.getModules();
    const newModulesArr = Array.from(curModulesArr);
    newModulesArr.push(module);
    ModuleObservable.setModules(newModulesArr);
    this.SaveChanges();
    this.togglePopup();
  }

  togglePopup = () => {
    this.setState({
      isadding: !this.state.isadding
    });
  }
  
  render() {
    return (
      <div className={style.moduleFooter}>
            <ModuleButton action="undo" title="Undo Changes" disabled={!this.state.isChanged} clickHandler={this.UndoChanges} />
            <span className={style.moduleButtonSep}></span>
            <ModuleButton action="save" title="Save Changes" disabled={!this.state.isChanged} clickHandler={this.SaveChanges} />
            <ModuleButton action="add" title="Add module" disabled={false} clickHandler={this.togglePopup} />
            {this.state.isadding ?
            <ModuleForm text='Adding module...' Cansel={this.togglePopup} Add={this.AddModule}/>
            :null
            }
      </div>
        
    );
  }
}