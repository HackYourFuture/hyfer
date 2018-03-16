import React, { Component } from 'react';
import styles from '../../assets/styles/timeline.css';
import ModuleReadme from '../../components/ModuleReadme/ModuleReadme';
import Attendance from '../../components/Attendance/Attendance';

import TimelineComp from '../../components/timelineComp/Timeline/Timeline';

import {
  READ_ME_CHANGED,
  REPO_NAME_CHANGED,
  HISTORY_CHANGED,
  moduleInfoStore,
  LOGIN_STATE_CHANGED,
  ISTEACHER_STATE_CHANGED,
  uiStore,
  timelineStore,
  TIMELINE_ITEMS_CHANGED,
  TIMELINE_GROUPS_CHANGED,
  ALL_WEEKS_CHANGED,
  TODAY_MARKER_REFERENCE,
  SELECTED_MODULE_ID_CHANGED,
  ALL_POSSIBLE_MODULES_CHANGED,
  GROUPS_WITH_IDS_CHANGED,
  ALL_TEACHERS_CHAGNED,
  INFO_SELECTED_MDOULE_CHANGED
} from '../../store/index';

export default class TimeLine extends Component {
  state = {
    isLoggedIn: false,
    isATeacher: false,
    tab: "readme",
    readme: null,
    repoName: null,
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
    groupsWithIds: null,
    teachers: null,
    infoSelectedModule: null
  };

  timelineObserver = mergedData => {
    switch (mergedData.type) {
      case TIMELINE_ITEMS_CHANGED:
        this.setState({ timelineItems: mergedData.payload.items });
        break;
      case ALL_TEACHERS_CHAGNED:
        this.setState({ teachers: mergedData.payload.teachers });
        break;
      case GROUPS_WITH_IDS_CHANGED:
        this.setState({ groupsWithIds: mergedData.payload.groupsWithIds });
        break;
      case TODAY_MARKER_REFERENCE:
        this.setState({ todayMarkerRef: mergedData.payload.todayMarkerRef });
        break;
      case TIMELINE_GROUPS_CHANGED:
        this.setState({ groups: mergedData.payload.groups });
        break;
      case SELECTED_MODULE_ID_CHANGED:
        this.setState({
          selectedModule: mergedData.payload.selectedModule
        });
        break;
      case ALL_WEEKS_CHANGED:
        const { allWeeks } = mergedData.payload;
        this.setState({ allWeeks: allWeeks });
        break;
      case ALL_POSSIBLE_MODULES_CHANGED:
        const { modules } = mergedData.payload;
        this.setState({ modules });
        break;
      case INFO_SELECTED_MDOULE_CHANGED:
        this.setState({
          infoSelectedModule: mergedData.payload.allModulesOfGroup
        });
        break;
      default:
        break;
    }
  };

  componentWillMount() {
    timelineStore.subscribe(this.timelineObserver);
  }

  componentDidMount() {
    moduleInfoStore.subscribe(mergedData => {
      if (mergedData.type === REPO_NAME_CHANGED) {
        this.setState({ repoName: mergedData.payload.repoName });
      } else if (mergedData.type === READ_ME_CHANGED) {
        this.setState({ readme: mergedData.payload.readme });
      } else if (mergedData.type === HISTORY_CHANGED) {
        this.setState({
          history: mergedData.payload.history,
          students: mergedData.payload.students,
          duration: mergedData.payload.duration,
          group_name: mergedData.payload.group_name
        });
      }
    });

    moduleInfoStore.defaultReadme('curriculum');

    uiStore.subscribe(mergedData => {
      if (mergedData.type === LOGIN_STATE_CHANGED) {
        this.setState({ isLoggedIn: mergedData.payload.isLoggedIn });
      } else if (mergedData.type === ISTEACHER_STATE_CHANGED) {
        this.setState({ isATeacher: mergedData.payload.isATeacher });
      }
    });

    if (localStorage.token) {
      uiStore.getUserInfo();
    }
  }

  itemClickHandler = (clickEvent, item) => {
    moduleInfoStore.getHistory(clickEvent, this.state.isATeacher);
    const selectedItemInStore = timelineStore.getState().selectedModule;
    if (
      !item ||
      (selectedItemInStore &&
        item.running_module_id === selectedItemInStore.running_module_id)
    ) {
      // if the clicked module is the same on unselect it
      item = null;
    } else {
      timelineStore.getSelectedModuleInfo(item);
    }
    timelineStore.setState({
      type: SELECTED_MODULE_ID_CHANGED,
      payload: {
        selectedModule: item
      }
    });
  }

  render() {
    // last item being set in store
    const {
      students,
      group_name,
      duration,
      history,
      repoName,
      readme,
      isATeacher,
      isLoggedIn,
      timelineItems,
      groups,
      allWeeks,
      totalWeeks,
      selectedModule,
      modules,
      groupsWithIds,
      teachers,
      infoSelectedModule,
      tab
    } = this.state;

    let content = <ModuleReadme readme={readme} repoName={repoName}/>
    if ( tab === "attendance") {
       content = <Attendance 
       repoName={repoName}
       history={history}
       duration={duration}
       group_name={group_name}
       students={students}
      />
    }

    if (isLoggedIn && isATeacher){
      return (
        <main>
          <div style={{ marginBottom: '3rem' }}>
            <TimelineComp
              itemWidth={170}
              rowHeight={70}
              isTeacher={isATeacher}
              timelineItems={timelineItems}
              groups={groups}
              allWeeks={allWeeks}
              totalWeeks={totalWeeks}
              selectedModule={selectedModule}
              itemClickHandler={this.itemClickHandler}
              allModules={modules}
              groupsWithIds={groupsWithIds}
              teachers={teachers}
              infoSelectedModule={infoSelectedModule}
            />
          </div>
          <div className={styles.tabs}>
            <button className={styles.ReadmeTab} 
              onClick={()=>this.setState({tab: "readme"})}
            >Readme</button>
            <button className={styles.AttendanceTab} 
            onClick={()=>this.setState({tab: "attendance"})}
            >Attendance</button>
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
              isTeacher={isATeacher}
              timelineItems={timelineItems}
              groups={groups}
              allWeeks={allWeeks}
              totalWeeks={totalWeeks}
              selectedModule={selectedModule}
              itemClickHandler={this.itemClickHandler}
              allModules={modules}
              groupsWithIds={groupsWithIds}
              teachers={teachers}
              infoSelectedModule={infoSelectedModule}
            />
          </div>
          <ModuleReadme readme={readme} repoName={repoName}/>
        </main>
      );
    }
  }
}
