/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import styles from './homework.css';

@inject('homeworkStore')
@observer
export default class Review extends Component {
  render() {
    const { currentUserStore, students } = this.props.homeworkStore;
    const { reviewerId, comments, date } = this.props;

    //currentUserStore is separate entry in db
    const reviewer =
      students.filter(student => student.id === reviewerId)[0] || currentUserStore;

    return (
      <div className={styles.review}>
        <h6 className={styles.timestamp}>{moment(date).format('LLL')}</h6>
        <h3>{reviewer.username}</h3>
        <img src={reviewer.avatarUrl} alt={reviewer.username} />
        <p>{comments}</p>
      </div>
    );
  }
}
