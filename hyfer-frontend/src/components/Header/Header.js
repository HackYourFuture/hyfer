import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import cookie from 'react-cookies';
import { NavLink, withRouter } from 'react-router-dom';
import hyfIcon from '../../assets/images/icon.png';
import styles from '../../assets/styles/header.css';

@inject('global')
@withRouter
@observer
export default class Header extends Component {

  SignOut = () => {
    localStorage.removeItem('token');
    cookie.save('token', '');
    window.location.reload();
  };

  render() {
    const { isLoggedIn, isTeacher, isStudent, avatarUrl } = this.props.global;

    const student = (
      <ul className={styles.signed_in}>
        <li>
          <img
            src={avatarUrl}
            alt="user icon"
            className={styles.userIcon}
          />
        </li>
        <ul className={styles.subNav}>
          <li>
            <a href="/" onClick={this.SignOut}>
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
    if (!isLoggedIn) {
      user = (
        <div className={styles.signInWrapper}>
          <div className={styles.visitorWrapper}>
            <span className={styles.visitor}>Visitor</span>
          </div>
          <div className={styles.signButtonWrapper}>
            <a
              href={process.env.NODE_ENV === 'development' ? `${process.env.REACT_APP_API_BASE_URL}/auth/github` : 'auth/github'}
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
              src={avatarUrl}
              alt="user icon"
              className={styles.userIcon}
            />
          </li>
          <ul className={styles.subNav}>
            <li>
              <a href="/" onClick={this.SignOut}>
                <span className={styles.subNavItem}>Sign Out</span>
              </a>
            </li>
          </ul>
        </ul>
      );
    }

    if (isLoggedIn && isTeacher) {
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
    } else if (isLoggedIn && isStudent) {
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
