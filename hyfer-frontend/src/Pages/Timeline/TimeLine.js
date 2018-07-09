import React, { Component } from 'react';
import ModuleReadme from '../../components/ModuleReadme/ModuleReadme';
import StudentInterface from '../../components/timelineComp/Tab/StudentInterface';
import TimelineComp from '../../components/timelineComp/Timeline/Timeline';
import { inject, observer } from 'mobx-react';

import {
  READ_ME_CHANGED,
  REPO_NAME_CHANGED,
  HISTORY_CHANGED,
  moduleInfoStore,
} from '../../store/index';
import { errorMessage } from '../../notify';
@inject('timeLineStore', 'currentModules', 'global')
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
    this.props.currentModules.fetchCurrentModuleUsers(item.id);
    this.props.currentModules.fetchModuleTeachers(item.running_module_id);

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
      repoName,
      readme,
      selectedModule,
      infoSelectedModule,
    } = this.state;

    const readMeContent = this.props.timeLineStore.items
      ? <ModuleReadme readme={readme} repoName={repoName} />
      : null;
    if (this.props.global.isTeacher || this.props.global.isStudent) {
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
