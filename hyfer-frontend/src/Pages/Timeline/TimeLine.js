import React, { Component } from 'react';
import styles from '../../assets/styles/timeline.css';
import ModuleReadme from '../../components/ModuleReadme/ModuleReadme';
import Attendance from '../../components/Attendance/Attendance';
import TimelineComp from '../../components/timelineComp/Timeline/Timeline';
import { inject, observer } from 'mobx-react';

import {
  READ_ME_CHANGED,
  REPO_NAME_CHANGED,
  HISTORY_CHANGED,
  moduleInfoStore,
} from '../../store/index';
import { errorMessage } from '../../notify';

@inject('timeLineStore', 'global')
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

  moduleInfoSubscriber = mergedData => {
    if (mergedData.type === REPO_NAME_CHANGED) {
      this.setState({ repoName: mergedData.payload.repoName });
    } else if (mergedData.type === READ_ME_CHANGED) {
      this.setState({ readme: mergedData.payload.readme });
    } else if (mergedData.type === HISTORY_CHANGED) {
      this.setState({
        history: mergedData.payload.history,
        students: mergedData.payload.students,
        duration: mergedData.payload.duration,
        group_name: mergedData.payload.group_name,
      });
    }
  };

  componentDidMount() {
    this.props.timeLineStore.fetchItems(true);
    moduleInfoStore.subscribe(this.moduleInfoSubscriber);
    moduleInfoStore.defaultReadme('curriculum').catch(errorMessage);
  }

  componentWillUnmount() {
    moduleInfoStore.unsubscribe(this.moduleInfoSubscriber);
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
    moduleInfoStore
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
      students,
      group_name,
      duration,
      history,
      repoName,
      readme,
      selectedModule,
      infoSelectedModule,
      tab,
    } = this.state;

    const readMeContent = this.props.timeLineStore.items
      ? <ModuleReadme readme={readme} repoName={repoName} />
      : null;

    let content = readMeContent;

    if (tab === 'attendance') {
      content = (
        <Attendance
          repoName={repoName}
          history={history}
          duration={duration}
          group_name={group_name}
          students={students}
        />
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
