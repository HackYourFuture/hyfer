import React, { Component } from 'react';
import ComponentTimeLine from 'react-visjs-timeline';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import Modal from '../../Helpers/Modal/Modal';
import styles from '../../assets/styles/timeline.css';
import loader from '../../assets/images/loader.gif';
import ModuleReadme from '../../components/ModuleReadme/ModuleReadme';
import Attendance from '../../components/Attendance/Attendance';
import Button from '../../Helpers/Button/Button';
import AddClassForm from '../../components/AddClassForm/AddClassForm';

import {
  MODAL_STATE_CHANGED,
  TIMELINE_GROUPS_CHANGED,
  TIMELINE_ITEMS_CHANGED,
  READ_ME_CHANGED,
  REPO_NAME_CHANGED,
  HISTORY_CHANGED,
  timelineStore,
  moduleInfoStore,
  LOGIN_STATE_CHANGED,
  ISTEACHER_STATE_CHANGED,
  uiStore
} from '../../store';

const options = {
  width: '100%',
  stack: false,
  showCurrentTime: true,
  dataAttributes: 'all',
  editable: true
};

export default class TimeLine extends Component {
  state = {
    groups: [],
    items: [],
    isModalOpen: false,
    isLoggedIn: false,
    readme: null,
    repoName: null,
    group_name: null,
    history: null,
    duration: null,
    students: null,
  };

  componentDidMount() {
    timelineStore.subscribe(mergedData => {
      switch (mergedData.type) {
        case TIMELINE_ITEMS_CHANGED:
          this.setState({ items: mergedData.payload.items });
          break;
        case TIMELINE_GROUPS_CHANGED:
          this.setState({ groups: mergedData.payload.groups });
          break;
        case MODAL_STATE_CHANGED:
          this.setState({ isModalOpen: mergedData.payload.isModalOpen });
          break;
        default:
          break;
      }
    });

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
          group_name: mergedData.payload.group_name,
        })                
      };
    });

    uiStore.subscribe(mergedData => {
      if (mergedData.type === LOGIN_STATE_CHANGED) {
        this.setState({ isLoggedIn: mergedData.payload.isLoggedIn });
      } else if (mergedData.type === ISTEACHER_STATE_CHANGED) {
        this.setState({ isATeacher: mergedData.payload.isATeacher });
      }
    });

    timelineStore.getTimelineItems();

    if (localStorage.token) {
      uiStore.getUserInfo();
    }
  }

  render() {
    const { items, groups, students, group_name, duration, history, repoName, readme } = this.state;
    let btn;
    if (this.state.isATeacher) {
      btn = (
        <Button
          onClick={timelineStore.handleToggleModal}
          className={styles.modalToggler}
        >
          Add a class
        </Button>
      );
    }
    if (items.length !== 0) {
      return (
        <main>
          {btn}
          <Modal
            classNames={{ modal: styles.modal }}
            isOpen={this.state.isModalOpen}
            handleToggleModal={timelineStore.handleToggleModal}
          >
            <AddClassForm />
          </Modal>
          <ComponentTimeLine
            clickHandler={moduleInfoStore.getHistory}
            items={[...items]}
            options={options}
            groups={[...groups]}
          />
          <Tabs>
            <TabList className={styles.tabs}>
              <Tab className={styles.tab} 
              >Readme</Tab>
              <Tab className={styles.tab}
              >Attendance</Tab>
            </TabList>

            <TabPanel>
                <ModuleReadme 
                readme={readme}
                repoName={repoName}
                />
            </TabPanel>

            <TabPanel>
                <Attendance 
                repoName={repoName}
                history={history}
                duration={duration}
                group_name={group_name}
                students={students}
                />
            </TabPanel>
          </Tabs>
        </main>
      );
    } else {
      return <img src={loader} alt="loader icon" className={styles.loader} />;
    }
  }
}
