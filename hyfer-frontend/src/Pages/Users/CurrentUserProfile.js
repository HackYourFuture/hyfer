/* eslint react/prop-types: error */
import PropTypes from 'prop-types';
import Moment from 'moment';
import React, { Component } from 'react';
import FaFire from 'react-icons/lib/fa/fire';
import FaGithub from 'react-icons/lib/fa/github';
import FaMobile from 'react-icons/lib/fa/mobile';
import FaSlack from 'react-icons/lib/fa/slack';
import MdEmail from 'react-icons/lib/md/email';
import { Link } from 'react-router-dom';
import styles from '../../assets/styles/users.css';
import { inject, observer } from 'mobx-react';

@inject('global', 'userStore')
@observer
export default class CurrentUserProfile extends Component {
  state = {
    mobileActive: false,
    slackActive: false,
  }
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const { currentUser: user } = this.props.global;
    if(user === null) {
      return null ;
    }
    return (
      <div>
        <ul className={styles.userContainer}>
          <li className={styles.userInformation}>
            <div>
              <div className={styles.imageContainer}>
                <img
                  className={styles.userAvatar}
                  src={`https://avatars.githubusercontent.com/${user.username}`}
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
                <div
                  className={
                    (user.role ? '' : styles.hidden) + ' ' + styles.role
                  }
                >
                  {user.role + (user.group_name ? ' / ' + user.group_name : '')}
                </div>
              </div>

              <div className={styles.linksContainer}>
                <div
                  className={
                    (user.username ? '' : styles.hidden) +
                    ' ' +
                    styles.linkContainer
                  }
                >
                  <a
                    href={'http://github.com/' + user.username}
                    target="_blank"
                  >
                    <FaGithub />
                  </a>
                </div>
                <div
                  className={
                    (user.slack_username ? '' : styles.hidden) +
                    ' ' +
                    styles.linkContainer
                  }
                  onClick={() => { this.setState({ slackActive: !this.state.slackActive }); }}
                >
                  <FaSlack />
                  <div
                    className={
                      styles.infoOverlay +
                      ' ' +
                      (this.state.slackActive ? styles.active : '')
                    }
                  >
                    {user.slack_username}
                  </div>
                </div>
                <div
                  className={
                    (user.mobile ? '' : styles.hidden) +
                    ' ' +
                    styles.linkContainer
                  }
                  onClick={() =>
                    this.setState({ mobileActive: !this.state.mobileActive })
                  }
                >
                  <FaMobile />
                  <div
                    className={
                      styles.infoOverlay +
                      ' ' +
                      (this.state.mobileActive ? styles.active : '')
                    }
                  >
                    {user.mobile}
                  </div>
                </div>
                <div
                  className={
                    (user.email ? '' : styles.hidden) +
                    ' ' +
                    styles.linkContainer
                  }
                >
                  <a href={'mailto:' + user.email} target="_blank">
                    <MdEmail />
                  </a>
                </div>
                <div
                  className={
                    (user.freecodecamp_username ? '' : styles.hidden) +
                    ' ' +
                    styles.linkContainer
                  }
                >
                  <a
                    href={
                      'http://freecodecamp.org/' + user.freecodecamp_username
                    }
                    target="_blank"
                  >
                    <FaFire />
                  </a>
                </div>
              </div>
            </div>
            <form
              className={styles.editUserButton}
              onClick={() => {
                this.props.userStore.getUserProfileInfo(user);
              }}
            >
              <Link to="/userAccount">
                <button type="button">EDIT</button>
              </Link>
            </form>
          </li>
        </ul>
      </div>
    );
  }
}


CurrentUserProfile.wrappedComponent.propTypes = {
  userStore: PropTypes.object.isRequired,
  global: PropTypes.object.isRequired,
};
