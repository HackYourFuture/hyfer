import React, { Component } from 'react'
import style from  '../../assets/styles/modules.css'

export default class ModuleHeader extends Component {

    weeksGrid = ['1 week', '2 weeks', '3 weeks', '4 weeks', '5 weeks', '6 weeks']

  render() {
    return (
        <div className={style.moduleHeader}>
        {this.weeksGrid.map( (item , index) => <div key={index} className="week_element">{item}</div>)}
        </div>
        
    )
  }
}