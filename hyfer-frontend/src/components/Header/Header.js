import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import hyfIcon from '../../assets/images/icon.png';
import styles from '../../assets/styles/header.css';
// import {
//   uiStore,
//   AVATAR_URL_CHANGED,
//   ISTEACHER_STATE_CHANGED,
//   ISSTUDENT_STATE_CHANGED,
//   LOGIN_STATE_CHANGED,
// } from '../../store';
import cookie from 'react-cookies';
import { errorMessage } from '../../notify';
import { observer , inject  } from "mobx-react";
@inject('UiStore')
@observer
export default class Header extends Component {
  // state = {
  //   isLoggedIn: false,
  //   isATeacher: false,
  //   isStudent: false,
  //   avatarUrl: null,
  // };

  componentDidMount = () => {
    // uiStore.subscribe(mergedData => {
    //   switch (mergedData.type) {
    //     case AVATAR_URL_CHANGED:
    //       this.setState({ avatarUrl: mergedData.payload.avatarUrl });
    //       console.log(' this is avatarurl '  +  mergedData.payload.avatarUrl );
    //       break;
    //     case LOGIN_STATE_CHANGED:
    //       this.setState({ isLoggedIn: mergedData.payload.isLoggedIn });
    //       console.log(' this is loginChanged '  +  mergedData.payload.isLoggedIn );
          
    //       break;
    //     case ISTEACHER_STATE_CHANGED:
    //       this.setState({ isATeacher: mergedData.payload.isATeacher });
    //       console.log(' this is teacher '  +  mergedData.payload.isATeacher );
          
    //       break;
    //     case ISSTUDENT_STATE_CHANGED:
    //       this.setState({ isStudent: mergedData.payload.isStudent });
    //       console.log(' this is student '  +  mergedData.payload.isStudent );
          
    //       break;
    //     default:
    //     console.log(mergedData.payload);
        
    //       break;
    //   }
    // });
    // this.setState({
    //   isLoggedIn : this.props.UiStore.isLoggedIn,
    //   isATeacher : this.props.UiStore.isATeacher,
    //   isStudent : this.props.UiStore.isStudent,
    //   avatarUrl : this.props.UiStore.avatarUrl

    // });

    const token = localStorage.getItem('token');
    let login = false;
    if (token && token !== '') login = true;

    // uiStore.setState({
    //   type: LOGIN_STATE_CHANGED,
    //   payload: {
    //     isLoggedIn: login,
    //   },
    // });
this.props.UiStore.changeLogin(login);
    if (login) {
     this.props.UiStore.getUserInfo().catch(errorMessage);
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
            src={this.props.UiStore.avatarUrl}
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
    if (!this.props.UiStore.isLoggedIn) {
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
              src={this.props.UiStore.avatarUrl}
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

    if (this.props.UiStore.isLoggedIn && this.props.UiStore.isATeacher) {
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
    } else if (this.props.UiStore.isLoggedIn && this.props.UiStore.isStudent) {
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
