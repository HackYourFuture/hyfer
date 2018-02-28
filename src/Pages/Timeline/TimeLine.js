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
    isLoggedIn: false
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
    const { items, groups } = this.state;
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
            // clickHandler={moduleInfoStore.getReadme}
            clickHandler={moduleInfoStore.getHistory}
            items={[...items]}
            options={options}
            groups={[...groups]}
          />
          <Tabs>
            <TabList className={styles.tabs}>
              <Tab className={styles.tab}>Readme</Tab>
              <Tab className={styles.tab}>Attendance</Tab>
            </TabList>

            <TabPanel>
              <div>
                <ModuleReadme />
              </div>
            </TabPanel>

            <TabPanel>
              <div>
                <Attendance />
              </div>
            </TabPanel>
          </Tabs>
        </main>
      );
    } else {
      return <img src={loader} alt="loader icon" className={styles.loader} />;
    }
  }
}
