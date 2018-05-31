import React, { Component } from 'react';
import classes from './modal.css';
import hyfIcon from '../../assets/images/icon.png';
import styles from '../../assets/styles/header.css';

export default class ModalDialog extends Component {
  handleClickBackdrop = e => {
    e.stopPropagation();
    if (e.target.classList.contains(classes.overlay)) {
      this.props.closeModal();
    }
  };

  render() {
    const x = () => {
      if (this.props.close) {
        return '';
      } else {
        return (
          <a className={classes.popup_close} onClick={this.props.closeModal}>
            x
          </a>
        );
      }
    };
    return (
      <div
        onMouseDown={this.handleClickBackdrop}
        className={classes.overlay}
        style={{
          visibility: this.props.visible ? 'visible' : 'hidden',
          opacity: this.props.visible ? '1' : '0',
        }}
      >
        <div className={classes.popup}>
          <div className={classes.popup_header}>
            <a href="http://hackyourfuture.net/">
              <img
                src={hyfIcon}
                alt="HackYourFuture logo"
                className={styles.hyfIcon}
              />
            </a>
            {x()}
            <span>{this.props.title}</span>
          </div>
          <div className={classes.popup_content}>{this.props.children}</div>
        </div>
      </div>
    );
  }
}
