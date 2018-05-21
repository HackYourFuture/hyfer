import React, { Component } from 'react'
import store from '../../store/UserStore';
import styles from '../../assets/styles/users.css';
import { Link } from 'react-router-dom';
import Moment from 'moment';

import MdEmail from 'react-icons/lib/md/email';
import FaSlack from 'react-icons/lib/fa/slack';
import FaFire from 'react-icons/lib/fa/fire';
import FaGithub from 'react-icons/lib/fa/github';
import FaMobile from 'react-icons/lib/fa/mobile';
import { errorMessage } from '../../notify';

class currentUserProfile extends Component {
  
  componentWillMount = () => {
    this.subscription = store.subscribe(state => {
      this.setState(state);
    });
  };

  componentWillUnmount() {
    this.subscription.remove();
  }

  componentDidMount = () => {
    store.loadUser().catch(errorMessage)
    window.scrollTo(0, 0);
  };
  render() {
    const user =  store.state.currentUser
    return (
      <div>
        <ul className={styles.userContainer}>
          <li className={styles.userInformation}>
            <div>
              <div className={styles.imageContainer}>
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
              </div>

              <div className={styles.titleContainer}>
                <div className={user.register_date ? '' : styles.hidden}>
                  {new Moment(user.register_date).format('DD MMMM YYYY')}
                </div>
                <div className={styles.userName}>{user.full_name}</div>
                <div className={(user.role ? '' : styles.hidden) + ' ' + styles.role}>
                  {user.role + (user.group_name ? ' / ' + user.group_name : '')}
                </div>
              </div>


              <div className={styles.linksContainer}>
                <div className={(user.username ? '' : styles.hidden) + ' ' + styles.linkContainer}>
                  <a href={'http://github.com/' + user.username} target="_blank">
                    <FaGithub />
                  </a>
                </div>
                <div className={(user.slack_username ? '' : styles.hidden) + ' ' + styles.linkContainer}
                  onClick={(e) => { }}>
                  <FaSlack />
                  <div className={styles.infoOverlay + ' ' + (user.slackActive ? styles.active : '')}>
                    {user.slack_username}
                  </div>
                </div>
                <div className={(user.mobile ? '' : styles.hidden) + ' ' + styles.linkContainer}
                  onClick={(e) => store.setState({ mobileActive: !store.state.mobileActive })}>
                  <FaMobile />
                  <div className={styles.infoOverlay + ' ' + (store.state.mobileActive ? styles.active : '')}>
                    {user.mobile}
                  </div>
                </div>
                <div className={(user.email ? '' : styles.hidden) + ' ' + styles.linkContainer}>
                  <a href={'mailto:' + user.email} target="_blank">
                    <MdEmail />
                  </a>
                </div>
                <div className={(user.freecodecamp_username ? '' : styles.hidden) + ' ' + styles.linkContainer}>
                  <a href={'http://freecodecamp.org/' + user.freecodecamp_username} target="_blank">
                    <FaFire />
                  </a>
                </div>
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
              <Link to="/userAccount">
                <button type="button">EDIT</button>
              </Link>
            </form>
          </li>
        </ul>
      </div>
    )
  }
}

  export default currentUserProfile
