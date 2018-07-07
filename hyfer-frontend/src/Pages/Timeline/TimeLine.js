import React, { Component } from 'react';
import styles from '../../assets/styles/timeline.css';
import ModuleReadme from '../../components/ModuleReadme/ModuleReadme';
import Attendance from '../../components/Attendance/Attendance';
import TimelineComp from '../../components/timelineComp/Timeline/Timeline';
import { inject, observer } from 'mobx-react';
import { errorMessage } from '../../notify';

@inject('timeLineStore', 'global', 'modulesInfoStore')
@observer

export default class TimeLine extends Component {
  state = {
    tab: 'readme',
    readme: null,
    repoName: 'curriculum',
    group_name: null,
    history: null,
    duration: null,
    students: null,
    groups: null,
    selectedModule: null,
    infoSelectedModule: null,
  };

  componentDidMount() {
    const {
      readme,
      repoName,
      group_name,
      history,
      duration,
      students,
      groups,
    } = this.props.modulesInfoStore;

    this.props.timeLineStore.fetchItems(true);
    this.props.modulesInfoStore.defaultReadme('curriculum').catch(errorMessage);
    this.setState({
      readme : readme,
      repoName : repoName,
      group_name : group_name,
      history : history,
      duration : duration,
      students : students,
      groups : groups,
    });
  }

  getSelectedModuleInfo = item => {
    this.props.timeLineStore.getModulesOfGroup(item.id)
      .then(res => {
        this.setState({
          infoSelectedModule: res[item.position],
        });
      })
      .catch(errorMessage);
  };

  itemClickHandler = (clickEvent, item) => {
    this.props.modulesInfoStore
      .getHistory(clickEvent, this.props.global.isTeacher)
      .catch(errorMessage);
    const selectedItemInStore = this.props.timeLineStore.items;
    if (
      !item ||
      (selectedItemInStore &&
        item.running_module_id === selectedItemInStore.running_module_id)
    ) {
      // if the clicked module is the same on unselect it
      item = null;
    } else {
      this.getSelectedModuleInfo(item);
      this.setState({
        selectedModule: item,
      });
    }
  };

  render() {
    // last item being set in store
    const {
      selectedModule,
      infoSelectedModule,
      tab,
    } = this.state;

    const readMeContent = this.props.timeLineStore.items
      ? <ModuleReadme />
      : null;

    let content = readMeContent;

    if (tab === 'attendance') {
      content = (
        <Attendance/>
      );
    }

    if (this.props.global.isTeacher) {
      return (
        <main>
          <div style={{ marginBottom: '3rem' }}>
            <TimelineComp
              itemWidth={170}
              rowHeight={70}
              selectedModule={selectedModule}
              itemClickHandler={this.itemClickHandler}
              infoSelectedModule={infoSelectedModule}
            />
          </div>
          <div className={styles.tabs}>
            <button
              className={styles.ReadmeTab}
              onClick={() => this.setState({ tab: 'readme' })}
            >
              Readme
            </button>
            <button
              className={styles.AttendanceTab}
              onClick={() => this.setState({ tab: 'attendance' })}
            >
              Attendance
            </button>
          </div>
          {content}
        </main>
      );
    } else {
      return (
        <main>
          <div style={{ marginBottom: '3rem' }}>
            <TimelineComp
              itemWidth={170}
              rowHeight={70}
              selectedModule={selectedModule}
              itemClickHandler={this.itemClickHandler}
              infoSelectedModule={infoSelectedModule}
            />
          </div>
          {readMeContent}
        </main>
      );
    }
  }
}
