import React, { Component } from 'react';
import Styles from '../../assets/styles/wrap.css';

class wrap extends Component {
  render() {
    const { remainingCards, selectedStudents } = this.props;
    return (
      <div>
        <div className={Styles.wrapContainer}>
          <div className={Styles.studentCount}>
            <span>
              You have been select (
              <strong>{selectedStudents.length}</strong>
              )Students.
            </span>
          </div>
          {remainingCards.length === 0 ? (
            <div className={Styles.leftCard}>
              <span>There is no left Cards, all are used..!</span>
            </div>
          ) : (
            <div>
              <div className={Styles.note}>
                <span>
                  Please make sure to copy the remaining Couponcode before you
                  move on!{' '}
                </span>
              </div>
              <ul className={Styles.codeList}>
                {remainingCards.map(card => {
                  return <li key={card}>Couponcode: {card}</li>;
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default wrap;
