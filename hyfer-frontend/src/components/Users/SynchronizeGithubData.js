import React, { Component } from 'react';
import style from '../../assets/styles/SynchronizeGithubData.css';

export default class SynchronizeGithubData extends Component {

  synchronizeData = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/githubSync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    return (
      <div>
        <button
          onClick={this.synchronizeData}
          className={style.syncButton}
        >Synchronize
        </button>
      </div>
    );
  }
}
