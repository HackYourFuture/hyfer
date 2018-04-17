import React, { Component } from 'react'
import Resizable from 're-resizable'
import style from  '../../assets/styles/modules.css'
import ModuleObservable from './ModuleObservable'
import ModuleForm from './ModuleForm'

export default class ModuleItem extends Component {

    state = {
        isMenuShow: false,
        isEditing: false
    }

    showMenu = () => {
        this.setState({ isMenuShow: true })
    }

    hideMenu = () => {
        this.setState({ isMenuShow: false })
    }

    EditModule = () => {
        this.setState({
            isMenuShow: false,
            isEditing: true
        })
    }

    showAddModal = () => {
        this.setState({ isEditing: true })
    }

    hideAddModal = () => {
        this.setState({ isEditing: false })
    }

    DeleteModule = () => {
        const curModulesArr = ModuleObservable.getModules()
        let newModulesArr = curModulesArr.map(a => ({ ...a }))
        newModulesArr = newModulesArr.filter(m => m.id !== this.props.module.id)
        ModuleObservable.setModules(newModulesArr)
      }

    UpdateModule = (module) => {
        const curModulesArr = ModuleObservable.getModules()
        let newModulesArr = curModulesArr.map(a => {
            if (a.id === module.id) {
                return module
            } else {
                return { ...a }
            }
        })
        ModuleObservable.setModules(newModulesArr)
    }

    render() {
        const module = this.props.module
        const moduleWidth = module.default_duration * this.props.weekWidth
        return (
            <div>
                <Resizable 
                    style={{backgroundColor:module.color}}
                    className={style.moduleItem} 
                    handleStyles={{ right: {
                        width: '4px',
                        height: '80%',
                        top: '10%',
                        right: '0px',
                        cursor: 'ew-resize',
                        backgroundColor: 'gray',
                        opacity:'0.8',
                        borderRadius:'2px'
                    }}}
                    size={{ width: moduleWidth }}
                    enable={{
                        top: false,
                        right: true,
                        bottom: false,
                        left: false,
                        topRight: false,
                        bottomRight: false,
                        bottomLeft: false,
                        topLeft: false
                    }}
                    grid= {[this.props.weekWidth , 1]}
                    minWidth = {this.props.weekWidth}
                    maxWidth = {this.props.weekWidth*6}
                    onResizeStop={(e, direction, ref, d) => {
                        const newDuration = Math.round(d.width/this.props.weekWidth)  
                        const modules = ModuleObservable.getModules()
                        const newModules = modules.map(a => ({...a}))
                        for(let m of newModules){
                            if(m.id === module.id){
                                m.default_duration += newDuration
                            }
                        }
                        ModuleObservable.setModules(newModules)
                    }}
                    onResizeStart={(e) => e.stopPropagation()}
                >
                    <div className={style.moduleItemContent}>
                        <md-icon class="material-icons" onClick={this.showMenu}>
                            more_vert
                        </md-icon>
                        {module.module_name}{module.optional === 1 ? "*" : ""}
                    </div>

                    <ul onMouseDown={(e) => e.stopPropagation()}
                        className={style.moduleMenu} 
                        style={{visibility:this.state.isMenuShow ? "visible" : "hidden", 
                        opacity:this.state.isMenuShow ? "1" : "0"}}>
                        <li>
                            <button style={{color: "#3e43cc"}} onClick={this.EditModule}>
                                <md-icon class="material-icons">edit</md-icon>
                                <span>Edit</span>
                            </button>
                        </li>
                        <li className={style.menuSep}></li>
                        <li>
                            <button style={{ color: module.ref_count > 0 ? "" : "#FF5722" }}
                                disabled={module.ref_count > 0 ? true : false}
                                onClick={this.DeleteModule}>
                                <md-icon class="material-icons">delete</md-icon>
                                <span>Delete</span>
                            </button>
                        </li>
                    </ul>

                    <div onMouseDown={this.hideMenu}
                        className={style.menuOverlay}
                        style={{ display: this.state.isMenuShow ? "block" : "none" }}>
                    </div>
                </Resizable>
                <ModuleForm onCancel={this.hideAddModal}
                    onAdd={this.UpdateModule}
                    visible={this.state.isEditing}
                    title={"Update Module " + this.props.module.module_name + ".."}
                    module={this.props.module}
                    actionName="UPDATE"
                />
            </div>
        )
    }
}
