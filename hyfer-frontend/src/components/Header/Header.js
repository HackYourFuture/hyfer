import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import cookie from 'react-cookies';
import { NavLink } from 'react-router-dom';
import hyfIcon from '../../assets/images/icon.png';
import styles from '../../assets/styles/header.css';
import { errorMessage } from '../../notify';
import { AVATAR_URL_CHANGED, ISSTUDENT_STATE_CHANGED, LOGIN_STATE_CHANGED, uiStore } from '../../store';


@inject('global')
@observer
export default class Header extends Component {
  state = {
    isLoggedIn: false,
    isStudent: false,
    avatarUrl: null,
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
        case ISSTUDENT_STATE_CHANGED:
          this.setState({ isStudent: mergedData.payload.isStudent });
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
        isLoggedIn: login,
      },
    });

    if (login) {
      uiStore.getUserInfo().catch(errorMessage);
    }
  };

  SignOut = () => {
    localStorage.removeItem('token');
    cookie.save('token', '');
    window.location.reload();
  };

  render() {
    const student = (
      <ul className={styles.signed_in}>
        <li>
          <img
            src={this.state.avatarUrl}
            alt="user icon"
            className={styles.userIcon}
          />
        </li>
        <ul className={styles.subNav}>
          <li>
            <a href="http://localhost:3000/" onClick={this.SignOut}>
              <span className={styles.subNavItem}>Sign Out</span>
            </a>
          </li>
          <li>
            <NavLink exact to="/currentUserProfile">
              <span className={styles.subNavItem}>My Profile</span>
            </NavLink>
          </li>
        </ul>
      </ul>
    );

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
          <li>
            <img
              src={this.state.avatarUrl}
              alt="user icon"
              className={styles.userIcon}
            />
          </li>
          <ul className={styles.subNav}>
            <li>
              <a href="http://localhost:3000/" onClick={this.SignOut}>
                <span className={styles.subNavItem}>Sign Out</span>
              </a>
            </li>
          </ul>
        </ul>
      );
    }

    if (this.props.global.isLoggedIn && this.props.global.isTeacher) {
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
                  Modules
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
              <li>
                <NavLink
                  exact
                  to="/homework"
                  className={styles.item}
                  activeClassName={styles.activeNav}
                >
                  Homework
                </NavLink>
              </li>
              <li>
                <NavLink
                  exact
                  to="/TrainTicket"
                  className={styles.item}
                  activeClassName={styles.activeNav}
                >
                  Ticket
                </NavLink>
              </li>
            </ul>
          </nav>
          {user}
        </header>
      );
    } else if (this.state.isLoggedIn && this.state.isStudent) {
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
                  to="/homework"
                  className={styles.item}
                  activeClassName={styles.activeNav}
                >
                  Homework
                </NavLink>
              </li>
            </ul>
          </nav>
          {student}
        </header>
      );
    } else {
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
            </ul>
          </nav>
          {user}
        </header>
      );
    }
  }
}
