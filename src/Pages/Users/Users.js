import React from 'react';
import store from '../../store/UserStore';
import styles from '../../assets/styles/users.css';
import { Link } from 'react-router-dom';
import Moment from 'moment';

import FaGraduationCap from 'react-icons/lib/fa/graduation-cap';
import FaClockO from 'react-icons/lib/fa/clock-o';
import MdEmail from 'react-icons/lib/md/email';
import FaSlack from 'react-icons/lib/fa/slack';
import FaFire from 'react-icons/lib/fa/fire';
import FaGithub from 'react-icons/lib/fa/github';
import MdClass from 'react-icons/lib/md/class';
import FaMobile from 'react-icons/lib/fa/mobile';

export default class Users extends React.Component {
  componentWillMount = () => {
    this.subscription = store.subscribe(state => {
      this.setState(state);
    });
  };

  componentWillUnmount() {
    this.subscription.remove();
  }

  componentDidMount = () => {
    this.loadUsers();
    window.scrollTo(0, 0);
  };

  loadUsers() {
    fetch('http://localhost:3000/api/users')
      .then(res => res.json())
      .then(json => {
        store.setState({
          users: json,
          filteredUsers: json
        });
        return;
      })
      .catch(error => {
        console.log(error);
        throw new Error('Problem with Server: GET DATA');
      });
  }

  //eventhandler for SEARCH. it checks the values in 'allUserValues'
  searchUser = function(event) {
    let updatedList = store.state.users;

    updatedList = updatedList.filter(function(item) {
      let allUserValues =
        item.full_name +
        item.username +
        item.group_name +
        item.role +
        item.slack_username;
      return (
        allUserValues.toLowerCase().search(event.target.value.toLowerCase()) !==
        -1
      );
    });
    store.setState({
      filteredUsers: updatedList
    });
  };

  render() {
    return (
      <div className={styles.userSearchDiv}>
        <input
          className={styles.userSearchBox}
          type="text"
          placeholder="lookup someone"
          onChange={this.searchUser}
        />

        <ul className={styles.userContainer}>
          {store.state.filteredUsers.map((user, i) => (
            <React.Fragment key={user.id}>
              <li className={styles.userInformations}>
                <div>
                  <img
                    className={styles.userAvatar}
                    src={`https://avatars.githubusercontent.com/${
                      user.username
                    }`}
                    alt={`Profile - ${user.username}`}
                    onError={e => {
                      e.target.src = `https://api.adorable.io/avatars/100/${
                        user.full_name
                      }`;
                    }}
                  />
                  <div className={styles.userName}>{user.full_name}</div>
                  <div className={user.group_name ? '' : styles.hidden}>
                    <MdClass />
                    {user.group_name}
                  </div>
                  <div className={user.role ? '' : styles.hidden}>
                    <FaGraduationCap />
                    {user.role}
                  </div>
                  <div className={user.register_date ? '' : styles.hidden}>
                    <FaClockO />
                    {new Moment(user.register_date).format('DD MMMM YYYY')}
                  </div>
                  <div className={user.email ? '' : styles.hidden}>
                    <MdEmail />
                    {user.email}
                  </div>
                  <div className={user.slack_username ? '' : styles.hidden}>
                    <FaSlack />
                    {user.slack_username}
                  </div>
                  <div
                    className={user.freecodecamp_username ? '' : styles.hidden}
                  >
                    <FaFire />
                    {user.freecodecamp_username}
                  </div>
                  <div className={user.username ? '' : styles.hidden}>
                    <FaGithub />
                    {user.username}
                  </div>
                  <div className={user.mobile ? '' : styles.hidden}>
                    <FaMobile />
                    {user.mobile}
                  </div>
                </div>
                <form
                  className={styles.editUserButton}
                  onClick={() => {
                    store.setState({
                      id: user.id,
                      username: user.username,
                      full_name: user.full_name,
                      group_name: user.group_name,
                      role: user.role,
                      register_date: user.register_date,
                      email: user.email,
                      slack_username: user.slack_username,
                      freecodecamp_username: user.freecodecamp_username,
                      mobile: user.mobile,
                      group_id: user.group_id,

                      reset_id: user.id,
                      reset_username: user.username,
                      reset_full_name: user.full_name,
                      reset_group_name: user.group_name,
                      reset_role: user.role,
                      reset_register_date: user.register_date,
                      reset_email: user.email,
                      reset_slack_username: user.slack_username,
                      reset_freecodecamp_username: user.freecodecamp_username,
                      reset_mobile: user.mobile,
                      reset_group_id: user.group_id
                    });
                  }}
                >
                  <Link to="/profile">
                    <button type="submit">EDIT</button>
                  </Link>
                </form>
              </li>
            </React.Fragment>
          ))}
        </ul>
      </div>
    );
  }
}
