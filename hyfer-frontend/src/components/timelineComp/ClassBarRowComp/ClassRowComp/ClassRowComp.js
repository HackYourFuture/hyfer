import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import classes from './classRowComp.css';
import { errorMessage } from '../../../../notify';
import popUpStyle from './archivingPopUp.css';

const token = localStorage.getItem('token');

@inject('timeLineStore')
@observer
export default class ClassRowComp extends Component {
  state = {
    popUp: false,
  };

  confirmArchiving = () => {
    const { classId } = this.props;
    this.handleClassArchive(classId);
    this.setState({
      popUp: false,
    });
  };

  cancelArchiving = () => {
    this.setState({
      popUp: false,
    });
  };

  popUpDiv = () => {
    const { classId } = this.props;
    const group = this.props.timeLineStore.groupsWithIds.filter(
      group => group.group_name.replace(/ /g, '').slice(-2) === classId,
    );

    return (
      <div>
        <div className={popUpStyle.backDrop}>
          <div className={popUpStyle.popUp_window}>
            <p
              className={popUpStyle.confirm_q}
            >{`Are you sure you want to archive ${group[0].group_name} ??`}</p>
            <button
              className={popUpStyle.button_cancel}
              onClick={() => this.cancelArchiving()}
            >
              No
            </button>
            <button
              className={popUpStyle.button_yes}
              onClick={() => this.confirmArchiving()}
            >
              Yes
            </button>
          </div>
        </div>
        {this.rowButton()}
      </div>
    );
  };

  rowButton = () => {
    const { classId, height } = this.props;

    return (
      <div style={{ height: height + 'px' }} className={classes.container}>
        <button
          onClick={() => this.archivingPopUp()}
          className={this.props.classId && classes.groupId}
        >
          {classId}
        </button>
      </div>
    );
  };

  handleClassArchive = async id => {
    const group = this.props.timeLineStore.groupsWithIds.filter(
      group => group.group_name.replace(/ /g, '').substr(5) === id,
    );

    try {
      await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/groups/${group[0].id}`, {
        method: 'PATCH',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({
          archived: 1,
        }),
      });
      window.location.reload();
    } catch (err) {
      errorMessage(err);
    }
  };

  archivingPopUp = () => {
    this.setState({
      popUp: true,
    });
  };

  render() {
    if (this.state.popUp) {
      return this.popUpDiv();
    }
    return this.rowButton();
  }
}
