import React, { Component } from 'react';
import Resizable from 're-resizable';
import style from  '../../assets/styles/modules.css';
import ModuleObservable from './ModuleObservable';

export default class ModuleItem extends Component {

  render() {
     const module = this.props.module
     const moduleWidth = module.default_duration *  this.props.weekWidth
        return (
            <Resizable 
                style={{backgroundColor:module.color}}
                    className={style.moduleItem} 
                    handleStyles={{right: {
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
                enable = {{ top:false, right:true, bottom:false, left:false, topRight:false, bottomRight:false, bottomLeft:false, topLeft:false }}
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
                onResizeStart={(e)=>{
                    e.stopPropagation()
                }}
            >
                {module.module_name}{module.optional=="1"?"*":""}
            </Resizable>
        );
    
    }
}