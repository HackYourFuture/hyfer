import React, { Component } from 'react';

import classes from './classRowComp.css';

export default class ClassRowComp extends Component {
  render() {
    const { classId, height } = this.props;
    return (
      <div style={{ height: height + 'px' }} className={classes.container}>
        <span className={this.props.classId && classes.groupId}>{classId}</span>
      </div>
    );
  }
}
