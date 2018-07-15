import React, { Component } from 'react';
import style from '../assets/styles/ModalDialog.css';

export default class ModalDialog extends Component {
  state = {
    visible: false,
  };

  showDialog() {}

  render() {
    return (
      <div
        onMouseDown={e => {
          e.stopPropagation();
        }}
        className={style.overlay}
        style={{
          visibility: this.props.visible ? 'visible' : 'hidden',
          opacity: this.props.visible ? '1' : '0',
        }}
      >
        <div className={style.popup}>
          <div className={style.popup_header}>
            <a className={style.popup_close} onClick={this.props.closeClicked}>
              ×
            </a>
            <span>{this.props.title}</span>
          </div>
          <div className={style.popup_content}>{this.props.children}</div>
        </div>
      </div>
    );
  }
}
