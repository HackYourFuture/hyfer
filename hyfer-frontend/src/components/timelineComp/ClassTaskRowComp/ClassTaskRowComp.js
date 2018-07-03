import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';

import { getWeeksBeforeAndAfter } from '../../../util';
import TaskComp from './TaskComp/TaskComp';
import EmptyTaskCell from './EmptyTaskCell/EmptyTaskCell';

@inject('timeLineStore')
@observer
export default class ClassTaskRowComp extends Component {
  renderAllTaskComps = () => {
    const { allWeeks } = this.props.timeLineStore;
    const { width, height, items, selectedModule } = this.props;
    const { weeksBefore, weeksAfter } = getWeeksBeforeAndAfter(allWeeks, items);
    let rowCells = [];
    if (weeksBefore.length !== 0) {
      rowCells = weeksBefore.map(week => (
        <EmptyTaskCell key={week} week={week} width={width} height={height} />
      ));
      rowCells.pop();
    }

    const taskRowItems = items.map(item => {
      let active = false;
      if (selectedModule) {
        active = item.running_module_id === selectedModule.running_module_id;
      }
      return (
        <TaskComp
          teachers={this.props.teachers}
          groups={this.props.groups}
          itemClickHandler={this.props.itemClickHandler}
          active={active}
          key={item.running_module_id}
          item={{ ...item }}
          allModules={items}
          width={width}
          height={height}
          selectedModule={selectedModule}
          infoSelectedModule={this.props.infoSelectedModule}
        />
      );
    });
    rowCells = [...rowCells, ...taskRowItems];
    if (weeksAfter.length === 0) return rowCells;

    const cellsAfter = weeksAfter.map(week => (
      <EmptyTaskCell key={week} width={width} height={height} />
    ));

    return [...rowCells, ...cellsAfter];
  };
  render() {
    return <Fragment>{this.renderAllTaskComps()}</Fragment>;
  }
}
