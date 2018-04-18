import React, { Component } from 'react';

import classes from './roundButton.css';

export default class ModuleButton extends Component {
  render() {
    let className = classes.roundButton;
    if (this.props.className) {
      className += ` ${this.props.className}`;
    }
    return (
      <button
        title={this.props.title}
        className={className}
        disabled={this.props.disabled}
        onClick={this.props.clickHandler}
      >
        <md-icon class="material-icons">{this.props.action}</md-icon>
      </button>
    );
  }
}
