
import React, { Component } from 'react';
import style from '../../assets/styles/SynchronizeGithubData.css';
import { success, errorMessage } from '../../notify';
import loader from '../../assets/images/Ellipsis.gif';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
const token = localStorage.getItem('token');

@inject('userStore')
@observer
export default class SynchronizeGithubData extends Component {

  state = {
    isClicked: false,
    isLoading: false,
    syncUser: '',
    syncDate: '',
  }

  componentWillMount() {
    fetch(`http://localhost:3005/api/user/event/sync`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    }).then(res => res.json())
      .then((res) => {
        this.setState({
          syncUser: res[0].username,
          syncDate: res[0].date_created});
      });

  }

  SynchronizeData = async () => {
    try {
      this.setState({ isClicked: true, isLoading: true });
      console.log('state after : ', this.state.isClicked);
      await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/githubSync`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      }).then((res) => {
        if (res.status === 200) {
          success('Successfully Synchronized');
          this.setState({ isLoading: false });
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
    return (
      <div>
        <button
          disabled={this.state.isClicked}
          onClick={() => this.SynchronizeData()}
          className={style.syncButton}
        >
          {this.state.isLoading === false ? (
            'Sync'
          ) : (
              <img src={loader} alt="loader" className={style.loadingImg} />
            )}
        </button>
        <p
          className={style.syncUser}>
          *last Sync by :
        <strong>{this.state.syncUser}</strong>,{moment(this.state.syncDate).format("MMM Do YY")}
        </p>
      </div>
    );
  }
}
