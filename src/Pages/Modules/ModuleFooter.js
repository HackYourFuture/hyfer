import React, { Component } from 'react'
import style from '../../assets/styles/modules.css'
import ModuleButton from './ModuleButton'
import ModuleObservable from './ModuleObservable'
import ModuleServiceBack from './ModuleServiceBack'
import ModuleForm from './ModuleForm'
import { notify } from 'react-notify-toast'


export default class ModuleFooter extends Component {

    state = {
        isChanged: false,
        isadding: false
    }

    componentDidMount = () => {
        ModuleObservable.subscribe((newArr) => {
            this.setState({ isChanged: ModuleObservable.isChanged() })
        })
    }

    UndoChanges = () => {
        ModuleObservable.resetModules()
        notify.show('Your changes have been cancelled !', 'warning')
    }

    SaveChanges = () => {
        ModuleServiceBack.saveModules(ModuleObservable.getModules(), () => {
            ModuleServiceBack.loadModules((result) => ModuleObservable.initModules(result))
            notify.show('Your changes are successfully Saved !', 'success')
        })
    }

    AddModule = (module) => {
        const curModulesArr = ModuleObservable.getModules()
        const newModulesArr = Array.from(curModulesArr)

        let maxId = curModulesArr.map(m => m.id).reduce((max, cur) => Math.max(max, cur))
        module.id = maxId + 1
        newModulesArr.push(module)

        ModuleObservable.setModules(newModulesArr)
    }

    showAddModal = () => {
        this.setState({
            isadding: true
        })
    }

    hideAddModal = () => {
        this.setState({
            isadding: false
        })
    }

    render() {
        return (
            <div className={style.moduleFooter}>
                <ModuleButton action="undo"
                    title="Undo Changes"
                    disabled={!this.state.isChanged}
                    clickHandler={this.UndoChanges}
                />
                <span className={style.moduleButtonSep}></span>
                <ModuleButton action="save"
                    title="Save Changes"
                    disabled={!this.state.isChanged}
                    clickHandler={this.SaveChanges}
                />
                <ModuleButton action="add"
                    title="Add module"
                    disabled={false}
                    clickHandler={this.showAddModal}
                />
                <ModuleForm onCancel={this.hideAddModal}
                    onAdd={this.AddModule}
                    visible={this.state.isadding}
                    title="Adding Module.."
                    actionName="ADD"
                />
            </div>
        )
    }
}