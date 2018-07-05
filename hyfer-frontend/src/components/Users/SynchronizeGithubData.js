import React, { Component } from 'react';
import style from '../../assets/styles/SynchronizeGithubData.css';

const token = localStorage.getItem('token');

export default class SynchronizeGithubData extends Component {


  SynchronizeData = async () => {
    try {
      await fetch('http://localhost:3005/api/githubSync', {
        method: 'post',
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
          onClick={() => this.SynchronizeData()}
          className={style.syncButton}
        >Synchronize
        </button>
      </div>
    );
  }
}
