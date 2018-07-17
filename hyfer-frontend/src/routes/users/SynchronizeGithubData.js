
import React, { Component } from 'react';
import style from './SynchronizeGithubData.css';
import { success, errorMessage } from '../../notify';
import loader from '../../assets/images/Ellipsis.gif';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
const token = localStorage.getItem('token');

@inject('userStore', 'currentUser', 'timeline')
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
      await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/githubSync/${this.props.currentUser.currentUser.username}`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      }).then((res) => {
        if (res.status === 200) {
          success('Successfully Synchronized');
          this.setState({ isLoading: false });
          this.props.timeline.fetchItems();
        } else {
          errorMessage('Something went wrong please try again');
          this.setState({ isLoading: false });
        }
        this.props.userStore.loadUsers();
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
