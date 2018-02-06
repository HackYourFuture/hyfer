import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import ComponentTimeLine from 'react-visjs-timeline';
import Modal from 'react-responsive-modal';

import styles from '../../assets/styles/timeline.css';
import loader from '../../assets/images/loader.gif';
import ModuleReadme from '../ModuleReadme/ModuleReadme';
import Button from '../Helpers/Button/Button';
import AddClassForm from '../AddClassForm/AddClassForm';

console.log(styles.modalToggler);
const options = {
  width: '100%',
  stack: false,
  showCurrentTime: true,
  dataAttributes: 'all'
};

@inject('timelineStore', 'moduleInfoStore')
@observer
export default class TimeLine extends Component {
  componentDidMount() {
    this.props.timelineStore.getItems();
  }

  render() {
    const { items, groups } = this.props.timelineStore;
    if (items.length !== 0) {
      return (
        <main>
          <Button
            onClick={this.props.timelineStore.handleToggleModal}
            className={styles.modalToggler}
          >
            Add a class
          </Button>
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
