import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import hyfIcon from '../../assets/images/icon.png';
import styles from '../../assets/styles/header.css';

export default class Header extends Component {
  render() {
    let user = null;
    if (!localStorage.token) {
      user = (
        <div className={styles.signInWrapper}>
          <div className={styles.visitorWrapper}>
            <span className={styles.visitor}>Visitor</span>
          </div>
          <div className={styles.signButtonWrapper}>
            <a href="/auth/github" className={styles.signInButton}>
              Sign in
            </a>
          </div>
        </div>
      );
    } else {
      user = <img src="TODO:" alt="user icon" className={styles.userIcon} />;
    }
    return (
      <header className={styles.header}>
        <a href="http://hackyourfuture.net/">
          <img
            src={hyfIcon}
            alt="HackYourFuture logo"
            className={styles.hyfIcon}
          />
        </a>
        <nav className={styles.nav}>
          <ul className={styles.list}>
            <li>
              <NavLink
                className={styles.item}
                activeClassName={styles.activeNav}
                to="/timeline"
              >
                Timeline
              </NavLink>
            </li>
            <li>
              <NavLink
                className={styles.item}
                activeClassName={styles.activeNav}
                to="/modules"
              >
                Modlues
              </NavLink>
            </li>
            <li>
              <NavLink
                className={styles.item}
                activeClassName={styles.activeNav}
                to="/users"
              >
                Users
              </NavLink>
            </li>
          </ul>
        </nav>
        {user}
      </header>
    );
  }
}
