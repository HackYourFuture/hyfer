import React, { Component } from 'react';
// import styles from '../../assets/styles/timeline.css';
import ModuleReadme from '../../components/ModuleReadme/ModuleReadme';
// import Attendance from '../../components/Attendance/Attendance';
import StudentInterface from '../../components/timelineComp/Tab/StudentInterface';
import TimelineComp from '../../components/timelineComp/Timeline/Timeline';
import { inject, observer } from 'mobx-react';

import {
  READ_ME_CHANGED,
  REPO_NAME_CHANGED,
  HISTORY_CHANGED,
  moduleInfoStore,
  uiStore,
} from '../../store/index';
import { errorMessage } from '../../notify';

@inject('timeLineStore', 'currentModules', 'global')
@observer
export default class TimeLine extends Component {
  state = {
    isLoggedIn: false,
    isATeacher: false,
    tab: 'readme',
    readme: null,
    repoName: 'curriculum',
    group_name: null,
    history: null,
    duration: null,
    students: null,
    timelineItems: null,
    groups: null,
    allWeeks: null,
    todayMarkerRef: null,
    selectedModule: null,
    modules: null,
    teachers: null,
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

  // uiStoreSubscriber = mergedData => {
  //   if (mergedData.type === LOGIN_STATE_CHANGED) {
  //     this.setState({ isLoggedIn: mergedData.payload.isLoggedIn });
  //   } else if (mergedData.type === ISTEACHER_STATE_CHANGED) {
  //     this.setState({ isATeacher: mergedData.payload.isATeacher });
  //   }
  // };


  componentDidMount() {
    this.props.timeLineStore.fetchItems(true);
    moduleInfoStore.subscribe(this.moduleInfoSubscriber);
    // uiStore.subscribe(this.uiStoreSubscriber);

    moduleInfoStore.defaultReadme('curriculum').catch(errorMessage);

    if (localStorage.token) {
      uiStore.getUserInfo().catch(errorMessage);
    }
  }

  componentWillUnmount() {
    moduleInfoStore.unsubscribe(this.moduleInfoSubscriber);
    uiStore.unsubscribe(this.uiStoreSubscriber);
  }

  getSelectedModuleInfo = item => {
    this.props.currentModules.fetchCurrentModuleUser(item.id);
    this.props.currentModules.getGroupsByGroupName(item.group_name);
    this.props.currentModules.fetchModuleTeachers(item.running_module_id
    );

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
      .getHistory(clickEvent, this.state.isATeacher)
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
      // students,
      // group_name,
      // duration,
      // history,
      repoName,
      readme,
      timelineItems,
      totalWeeks,
      selectedModule,
      teachers,
      infoSelectedModule,
      tab,
    } = this.state;
    // console.log(this.props.timeLineStore.items);
    console.log(selectedModule);
    console.log(this.props.currentModules.currentModule);
    // let content = <ModuleReadme readme={readme} repoName={repoName} />;
    if (tab === 'attendance') {
      // content = (
      //   <Attendance
      //     repoName={repoName}
      //     history={history}
      //     duration={duration}
      //     group_name={group_name}
      //     students={students}
      //   />
      // );
    }

    if (this.props.global.isLoggedIn && this.props.global.isTeacher) {
      return (
        <main>
          <div style={{ marginBottom: '3rem' }}>
            <TimelineComp
              itemWidth={170}
              rowHeight={70}
              isTeacher={this.props.global.isTeacher}
              timelineItems={timelineItems}
              totalWeeks={totalWeeks}
              selectedModule={selectedModule}
              itemClickHandler={this.itemClickHandler}
              teachers={teachers}
              infoSelectedModule={infoSelectedModule}
            />
          </div>
          {/* <div className={styles.tabs}>
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
          </div> */}
          {/* {content} */}
          <StudentInterface />
        </main>
      );
    } else {
      return (
        <main>
          <div style={{ marginBottom: '3rem' }}>
            <TimelineComp
              itemWidth={170}
              rowHeight={70}
              isTeacher={this.props.global.isTeacher}
              timelineItems={timelineItems}
              totalWeeks={totalWeeks}
              selectedModule={selectedModule}
              itemClickHandler={this.itemClickHandler}
              teachers={null}
              infoSelectedModule={infoSelectedModule}
            />
          </div>
          <ModuleReadme readme={readme} repoName={repoName} />
        </main>
      );
    }
  }
}
