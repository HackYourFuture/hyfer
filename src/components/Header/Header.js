import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import hyfIcon from '../../assets/images/icon.png';
import styles from '../../assets/styles/header.css';
import {
  uiStore,
  AVATAR_URL_CHANGED,
  ISTEACHER_STATE_CHANGED,
  LOGIN_STATE_CHANGED
} from '../../store';
import cookie from 'react-cookies';

export default class Header extends Component {
  state = {
    isLoggedIn: false,
    isATeacher: false,
    avatarUrl: null
  };

  componentDidMount = () => {
    uiStore.subscribe(mergedData => {
      switch (mergedData.type) {
        case AVATAR_URL_CHANGED:
          this.setState({ avatarUrl: mergedData.payload.avatarUrl });
          break;
        case LOGIN_STATE_CHANGED:
          this.setState({ isLoggedIn: mergedData.payload.isLoggedIn });
          break;
        case ISTEACHER_STATE_CHANGED:
          this.setState({ isATeacher: mergedData.payload.isATeacher });
          break;
        default:
          break;
      }
    });

    const token = localStorage.getItem('token');
    let login = false;
    if (token && token !== '') login = true;

    uiStore.setState({
      type: LOGIN_STATE_CHANGED,
      payload: {
        isLoggedIn: login
      }
    });

    if (login) {
      uiStore.getUserInfo();
    }
  };

  SignOut = () => {
    localStorage.removeItem('token');
    cookie.save('token', '');
  };

  render() {
    let user = null;
    if (!this.state.isLoggedIn) {
      user = (
        <div className={styles.signInWrapper}>
          <div className={styles.visitorWrapper}>
            <span className={styles.visitor}>Visitor</span>
          </div>
          <div className={styles.signButtonWrapper}>
            <a
              href="http://localhost:3005/auth/github"
              className={styles.signInButton}
            >
              Sign in
            </a>
          </div>
        </div>
      );
    } else {
      user = (
        <ul className={styles.signed_in}>
          <li><img
            src={this.state.avatarUrl}
            alt="user icon"
            className={styles.userIcon}
          /></li>
          <li><div className={styles.menu}>
            <a
              href="http://localhost:3000/"
              onClick={this.SignOut}
            >
              Sign Out
            </a>
          </div></li>
        </ul>
      );
    }

    if (this.state.isLoggedIn && this.state.isATeacher) {
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
    } else { return (
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
          </ul>
        </nav>
        {user}
      </header>
    )}
  }
}
