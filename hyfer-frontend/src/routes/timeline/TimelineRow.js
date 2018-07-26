import PropTypes from 'prop-types';
import React from 'react';
import { observer, inject } from 'mobx-react';
import moment from 'moment';
import TimelineModule from './TimelineModule';
import EmptyWeekModule from './EmptyWeekModule';


export function getWeeksBeforeAndAfter(allWeeks, modules) {
  // starting date of the first module of a class
  const firstModuleStartingDate = moment.min(modules.map(week => week.starting_date));
  // the ending date of the last module of a class
  const lastModuleEndingDate = moment.max(modules.map(week => week.ending_date));
  // get an array with all the weeks before the start of this class
  const weeksBefore = allWeeks.filter(week => week[0].isBefore(firstModuleStartingDate));
  // get an array with all the weeks after the course has ended
  const weeksAfter = allWeeks.filter(week => week[1].isAfter(lastModuleEndingDate));

  return {
    weeksBefore,
    weeksAfter,
  };
}

@inject('timeline')
@observer
export default class TimelineRow extends React.Component {

  renderTimelineModules = () => {
    const { groupName } = this.props;
    const { allWeeks, groupItems } = this.props.timeline;

    const { modules } = groupItems[groupName];
    const { weeksBefore, weeksAfter } = getWeeksBeforeAndAfter(allWeeks, modules);

    let rowCells = weeksBefore.map(week => <EmptyWeekModule key={week} week={week} />);

    const taskRowItems = modules.map((item, index) => {
      return (
        <TimelineModule
          key={item.running_module_id}
          item={item}
          isLast={index === modules.length - 1}
        />
      );
    });

    rowCells = [...rowCells, ...taskRowItems];
    if (weeksAfter.length === 0) return rowCells;

    const cellsAfter = weeksAfter.map(week => (
      <EmptyWeekModule key={week} />
    ));

    return [...rowCells, ...cellsAfter];
  };

  render() {
    return <React.Fragment>{this.renderTimelineModules()}</React.Fragment>;
  }
}

TimelineRow.wrappedComponent.propTypes = {
  groupName: PropTypes.string.isRequired,
  timeline: PropTypes.object.isRequired,
};
