import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

import hyfIcon from '../../assets/images/icon.png';
import styles from '../../assets/styles/header.css';

@inject('uiStore')
@observer
export default class Header extends Component {
  componentDidMount = () => {
    if (localStorage.token && !this.props.uiStore.isLoggedIn) {
      this.props.uiStore.getUserInfo();
    }
  };

  render() {
    let user = null;
    if (!this.props.uiStore.isLoggedIn) {
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
      const imgUrl = this.props.uiStore.profileImgUrl;
      user = <img src={imgUrl} alt="user icon" className={styles.userIcon} />;
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
                exact
                to="/timeline"
                className={styles.item}
                activeClassName={styles.activeNav}
              >
                Timeline
              </NavLink>
            </li>
            <li>
              <NavLink
                exact
                to="/modules"
                className={styles.item}
                activeClassName={styles.activeNav}
              >
                Modlues
              </NavLink>
            </li>
            <li>
              <NavLink
                exact
                to="/users"
                className={styles.item}
                activeClassName={styles.activeNav}
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
