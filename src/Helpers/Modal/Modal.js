import React, { Component } from 'react';
import classes from './modal.css';

export default class ModalDialog extends Component {
  handleClickBackdrop = e => {
    e.stopPropagation();
    if (e.target.classList.contains(classes.overlay)) {
      this.props.closeModal();
    }
  };

  render() {
    return (
      <div
        onMouseDown={this.handleClickBackdrop}
        className={classes.overlay}
        style={{
          visibility: this.props.visible ? 'visible' : 'hidden',
          opacity: this.props.visible ? '1' : '0'
        }}
      >
        <div className={classes.popup}>
          <div className={classes.popup_header}>
            <a className={classes.popup_close} onClick={this.props.closeModal}>
              ×
            </a>
            <span>{this.props.title}</span>
          </div>
          <div className={classes.popup_content}>{this.props.children}</div>
        </div>
      </div>
    );
  }
}
