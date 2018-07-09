/* eslint react/prop-types: error */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ModuleReadMe from '../../components/ModuleReadme/ModuleReadme';
import CurrentModuleDetails from '../../components/CurrentModuleDetails';
import TimelineComp from '../../components/timelineComp/Timeline/Timeline';
import { inject, observer } from 'mobx-react';

@inject('global', 'timeLineStore', 'currentModuleStore')
@observer
export default class TimeLine extends Component {

  componentDidMount() {
    this.props.timeLineStore.fetchItems(true);
  }

  render() {
    if (this.props.timeLineStore.items == null) {
      return null;
    }

    const { isStudent, isTeacher } = this.props.global;

    return (
      <main>
        <div style={{ marginBottom: '3rem' }}>
          <TimelineComp
            itemWidth={170}
            rowHeight={70}
          />
        </div>
        {isStudent || isTeacher ? <CurrentModuleDetails /> : <ModuleReadMe />}
      </main>
    );
  }
}

TimeLine.wrappedComponent.propTypes = {
  global: PropTypes.object.isRequired,
  timeLineStore: PropTypes.object.isRequired,
  currentModuleStore: PropTypes.object.isRequired,
};
