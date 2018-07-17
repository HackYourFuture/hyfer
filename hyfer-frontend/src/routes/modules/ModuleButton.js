import React, { Component } from 'react';
import PropTypes from 'prop-types';
import style from './modules.css';

export default class ModuleButton extends Component {
  render() {
    return (
      <button
        type="button"
        className={style.moduleButton}
        title={this.props.title}
        disabled={this.props.disabled}
        onClick={this.props.clickHandler}
      >
        <md-icon class="material-icons">{this.props.action}</md-icon>
      </button>
    );
  }
}

ModuleButton.propTypes = {
  action: PropTypes.string.isRequired,
  clickHandler: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
};
