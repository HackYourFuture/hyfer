import React, { Component } from 'react';
import { NavLink, BrowserRouter, Route } from 'react-router-dom';
import ClassPage from './ClassPage';
import { getData } from '../../mobx/HomeworkStore';
import styles from '../../assets/styles/homework.css';

export default class Homework extends Component {
  state = {
    activeGroups: [],
  };

  async componentDidMount() {
    const groups = await getData('groups');
    const activeGroups = groups
      .filter(group => group.archived === 0)
      .map(group => group.group_name.replace(/ /g, '').toLowerCase());
    this.setState({ activeGroups });
  }

  render() {
    const { activeGroups } = this.state;

    return (
      <BrowserRouter>
        <div className={styles.homeworkPage}>
          <section className={styles.navBar}>
            {activeGroups.sort().map(group => (
              <NavLink
                key={group}
                to={'/homework/' + group}
                className={styles.navLink}
                activeClassName={styles.navLinkActive}
              >
                Class {group.substr(5)}
              </NavLink>
            ))}
          </section>

          {activeGroups.map(group => (
            <Route
              key={group}
              path={'/homework/' + group}
              exact
              render={props => <ClassPage {...props} studentClass={group} />}
            />
          ))}
        </div>
      </BrowserRouter>
    );
  }
}
