
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import style from './SynchronizeGithubData.css';
import stores from '../../stores';
import loader from '../../assets/images/Ellipsis.gif';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
const token = localStorage.getItem('token');

@inject('users', 'currentUser', 'timeline')
@observer
export default class SynchronizeGithubData extends Component {

  state = {
    isClicked: false,
    isLoading: false,
    syncUser: '',
    syncDate: '',
  }

  componentDidMount() {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/user/event/GITHUB_SYNC`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    }).then(res => res.json())
      .then((res) => {
        if (res.length > 0) {
          this.setState({
            syncUser: res[0].username,
            syncDate: res[0].date_created,
          });
        }
      });
  }

  synchronizeData = async () => {
    try {
      this.setState({ isClicked: true, isLoading: true });
      console.log('state after : ', this.state.isClicked);
      await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/githubSync/${this.props.currentUser.userName}`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      }).then((res) => {
        if (res.status < 400) {
          stores.notification.reportSuccess('Successfully synchronized');
          this.setState({ isLoading: false });
          this.props.timeline.fetchTimeline();
        } else {
          stores.notification.reportError(new Error('Something went wrong please try again'));
          this.setState({ isLoading: false });
        }
        this.props.users.loadUsers();
      });
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    const { syncDate, syncUser } = this.state;
    return (
      <div>
        <button
          disabled={this.state.isClicked}
          onClick={() => this.synchronizeData()}
          className={style.syncButton}
        >
          {this.state.isLoading === false ? (
            'Sync'
          ) : (
              <img src={loader} alt="loader" className={style.loadingImg} />
            )}
        </button>
        {syncDate &&
          <p
            className={style.syncUser}>
            *Last Sync by:
            <strong> {syncUser}</strong>, {moment(syncDate).format("DD MMMM YYYY")}
          </p>}
      </div>
    );
  }
}

SynchronizeGithubData.wrappedComponent.propTypes = {
  currentUser: PropTypes.object.isRequired,
  timeline: PropTypes.object.isRequired,
  users: PropTypes.object.isRequired,
};
