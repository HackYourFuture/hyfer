/* eslint react/prop-types: error */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import ModuleReadMe from '../../components/ModuleReadme/ModuleReadme';
import TimelineComp from '../../components/timelineComp/Timeline/Timeline';
import StudentInterface from '../../components/timelineComp/Tab/StudentInterface';

@inject('timeLineStore', 'global')
@observer
export default class TimeLine extends Component {

  componentDidMount() {
    this.props.timeLineStore.fetchItems(true);
  }

  render() {

    if (this.props.timeLineStore.items == null) {
      return null;
    }

    return (
      <main>
        <div style={{ marginBottom: '1rem' }}>
          <TimelineComp
            itemWidth={170}
            rowHeight={55}
          />
        </div>
        {this.props.global.isTeacher || this.props.global.isStudent ? <StudentInterface /> : <ModuleReadMe />}
      </main>
    );
  }
}

TimeLine.wrappedComponent.propTypes = {
  global: PropTypes.object.isRequired,
  timeLineStore: PropTypes.object.isRequired,
};
