import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import ComponentTimeLine from 'react-visjs-timeline';
import Modal from 'react-responsive-modal';

import styles from '../../assets/styles/timeline.css';
import loader from '../../assets/images/loader.gif';
import ModuleReadme from '../../components/ModuleReadme/ModuleReadme';
import Button from '../../Helpers/Button/Button';
import AddClassForm from '../../components/AddClassForm/AddClassForm';

console.log(styles.modalToggler);
const options = {
  width: '100%',
  stack: false,
  showCurrentTime: true,
  dataAttributes: 'all'
};

@inject('timelineStore', 'moduleInfoStore', 'uiStore')
@observer
export default class TimeLine extends Component {
  componentDidMount() {
    this.props.timelineStore.getItems();
    if (localStorage.token && !this.props.uiStore.isLoggedIn) {
      this.props.uiStore.getUserInfo();
    }
  }

  render() {
    const { items, groups } = this.props.timelineStore;
    let btn;
    if (this.props.uiStore.isATeacher) {
      btn = (
        <Button
          onClick={this.props.timelineStore.handleToggleModal}
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
            open={this.props.timelineStore.isModalOpen}
            onClose={this.props.timelineStore.handleToggleModal}
          >
            <AddClassForm />
          </Modal>
          <ComponentTimeLine
            clickHandler={this.props.moduleInfoStore.handleGetReadme}
            items={[...items]}
            options={options}
            groups={[...groups]}
          />
          <ModuleReadme />
        </main>
      );
    } else {
      return <img src={loader} alt="loader icon" className={styles.loader} />;
    }
  }
}
