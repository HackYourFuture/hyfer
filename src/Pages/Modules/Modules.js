import React, { Component } from 'react'
import ModuleHeader from './ModuleHeader'
import ModuleList from './ModuleList'
import ModuleFooter from './ModuleFooter'
import ModuleObservable from './ModuleObservable'
import ModuleServiceBack from './ModuleServiceBack'
import style from  '../../assets/styles/modules.css'

export default class Modules extends Component {

    state = {
        modulesArr: []
    }

    componentDidMount = () => {
        ModuleObservable.subscribe((newArr) => {
            this.setState({ modulesArr: newArr })
        })
        ModuleServiceBack.loadModules((result) => {
            ModuleObservable.initModules(result)
        })
    }

    render() {
        return (
            <div className={style.modeuleContainer}>
                <ModuleHeader />
                <ModuleList />
                <ModuleFooter />
                <div><p>* Optional modules</p></div>
            </div> 
        )
    }

}
