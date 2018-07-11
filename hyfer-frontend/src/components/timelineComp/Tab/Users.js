import React, { Component } from 'react';
import style from '../../../assets/styles/users.css';
import Moment from 'moment';
import linkedin from 'react-icons/lib/fa/linkedin';

export default class User extends Component {
  render() {
    const { user } = this.props;
    return (
      <li className={style.userInformation}>
        <div>
          <div className={style.imageContainer}>
            <img
              className={style.userAvatar}
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
          <div className={style.titleContainer}>
            <div
              className={user.register_date ? '' : style.hidden}
            >
              {new Moment(user.register_date).format(
                'DD MMMM YYYY'
              )}
            </div>
            <div className={style.userName}>{user.full_name}</div>
            <div
              className={
                (user.role ? '' : style.hidden) + ' ' + style.role
              }
            >
              {user.role +
                (user.group_name ? ' / ' + user.group_name : '')}
            </div>
            <div
              className={
                (user.linkedin_username ? '' : style.hidden) +
                ' ' +
                style.linkContainer
              }
              onClick={() => { }}
            >
              <linkedin />
              <div
                className={
                  style.infoOverlay +
                  ' ' +
                  (user.slackActive ? style.active : '')
                }
              >
                {user.slack_username}
              </div>
            </div>
          </div>
        </div>
      </li>
    );
  }
}
