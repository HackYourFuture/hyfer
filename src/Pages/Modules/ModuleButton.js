import React, { Component } from 'react'
import style from  '../../assets/styles/modules.css'

export default class ModuleButton extends Component {

    /*buttonClicked = ()=>{
      alert('click')
    }*/

  render() {
    return (
        <button type="button" className={style.moduleButton} 
        title={this.props.title} 
        disabled={this.props.disabled} 
        onClick={this.props.clickHandler}>
          <md-icon class="material-icons">{this.props.action}</md-icon>
        </button>
        
    )
  }
}