import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import hyfIcon from '../../assets/images/icon.png';
import styles from '../../assets/styles/header.css';

export default class Header extends Component {
  render() {
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
              <NavLink className={styles.item} to="/timeline">
                Timeline
              </NavLink>
            </li>
            <li>
              <NavLink className={styles.item} to="/modules">
                Modlues
              </NavLink>
            </li>
            <li>
              <NavLink className={styles.item} to="/users">
                Users
              </NavLink>
            </li>
          </ul>
        </nav>
        <img src="TODO:" alt="user icon" className={styles.userIcon} />
      </header>
    );
  }
}
