/* eslint react/prop-types: error */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

import ClassRowComp from './ClassRowComp/ClassRowComp';
import classes from './classBarRowComp.css';

@inject('global', 'timeLineStore')
@observer
export default class ClassBarRowComp extends Component {
  renderAllRowComp = () => {
    return this.props.timeLineStore.groups.map(group => (
      <ClassRowComp
        key={group}
        classId={group.replace(/ /g, '').substr(5)}
        height={this.props.rowHeight}
      />
    ));
  };

  render() {
    // margin top is width of one extra element + the margin on both sides
    const { rowHeight, myRef } = this.props;
    const marginTop = +rowHeight + 8;
    // displaying one extra component to fill in the empty place in the top-left corner
    return (
      <div
        style={{ marginTop: marginTop + 'px' }}
        className={classes.container}
        ref={myRef}
      >
        {this.renderAllRowComp()}
      </div>
    );
  }
}

ClassBarRowComp.wrappedComponent.propTypes = {
  global: PropTypes.object.isRequired,
  timeLineStore: PropTypes.object.isRequired,
  rowHeight: PropTypes.number.isRequired,
  myRef: PropTypes.object.isRequired,
};
