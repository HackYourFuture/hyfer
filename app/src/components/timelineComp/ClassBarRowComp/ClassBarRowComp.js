import React, { Component } from 'react';

import ClassRowComp from './ClassRowComp/ClassRowComp';
import classes from './classBarRowComp.css';

export default class ClassBarRowComp extends Component {
  renderAllRowComp = () => {
    if (!this.props.groups) return;
    return this.props.groups.map(group => (
      <ClassRowComp
        key={group}
        classId={group.split(' ')[1]}
        height={this.props.rowHeight}
      />
    ));
  };

  render() {
    // margin top is width of one extra element + the margin on both sides
    const marginTop = +this.props.rowHeight + 8;
    // displaying one extra component to fill in the empty place in the top-left corner
    return (
      <div
        ref="groupsRowContainer"
        style={{ marginTop: marginTop + 'px' }}
        className={classes.container}
      >
        {this.renderAllRowComp()}
      </div>
    );
  }
}
