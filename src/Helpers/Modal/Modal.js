import React, { Component, Fragment } from 'react';

import classes from '../../assets/styles/modal.css';

export default class Modal1 extends Component {
  render() {
    const { isOpen, handleToggleModal } = this.props;
    const backdrop = isOpen ? (
      <div className={classes.backdrop} onClick={handleToggleModal} />
    ) : null;
    return (
      <Fragment>
        {backdrop}
        <div
          className={classes.modal}
          style={{
            transform: isOpen ? 'translateY(0)' : 'translateY(-100vh)',
            opacity: isOpen ? '1' : '0'
          }}
        >
          <span
            onClick={handleToggleModal}
            className={classes.exitBtn}
            role="img"
            aria-label="Cross-mark"
          >
            ✖
          </span>
          {this.props.children}
        </div>
      </Fragment>
    );
  }
}
