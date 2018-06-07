import React from 'react';
// import store from '../../store/UserStore';
import styles from '../../assets/styles/profile.css';
import { Link } from 'react-router-dom';
import { getAllGroupsWithIds } from '../../util';
import { errorMessage } from '../../notify';
import { observer, inject } from 'mobx-react';

@inject('userStore')
@observer

export default class Profile extends React.Component {
  state = {
    classOptions: [],
  };

  componentDidMount() {
    // this.subscription = store.subscribe(state => {
    //   this.setState(state);
    // });

    const getData = async () => {
      const groupData = await getAllGroupsWithIds().catch(errorMessage); // catching the error in the end of the line

      groupData.map(group => {
        return {
          groupsName: group.group_name,
          groupsId: group.id,
        };
      });

      this.setState({
        classOptions: groupData,
      });
    };
    getData();
    window.scrollTo(0, 0);
  }

  setInputActive = e => {
    e.target.parentElement.className += ' ' + styles.isActive;
    e.target.parentElement.className += ' ' + styles.isCompleted;
  };

  componentWillUnmount() {
    // this.subscription.remove();
  }

  checkHasValue(val) {
    return !val || val.length === 0 ? '' : styles.isCompleted;
  }

  render() {
    return (
      <div className={styles.profilePage}>
        <Link to="/users">
          <input className={styles.backButton} type="button" value="&#8249;" />
        </Link>
        <h1>Edit Profile</h1>
        <div className={styles.profileContainer}>
          <div
            className={
              styles.matDiv + ' ' + this.checkHasValue(this.props.userStore.full_name)
            }
          >
            <label htmlFor="first-name" className={styles.matLabel}>
              First Name
            </label>
            <input
              className={styles.matInput}
              type="text"
              value={this.props.userStore.full_name}
              id="first-name"
              onChange={e => {
                this.props.userStore.changeFullName(e);
              }}
              onFocus={e => {
                this.setInputActive(e);
              }}
            />
          </div>

          <div
            className={
              styles.small + ' ' + styles.matDiv + ' ' + styles.isCompleted
            }
          >
            <label htmlFor="role" className={styles.matLabel}>
              Role
            </label>
            <select
              value={this.props.userStore.role}
              id="role"
              className={styles.matInput}
              onChange={e => {
                this.props.userStore.changeRole(e);
              }}
            >
              <option value="guest" disabled hidden>
                Role
              </option>
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
            </select>
          </div>

          <div
            className={
              styles.small + ' ' + styles.matDiv + ' ' + styles.isCompleted
            }
          >
            <label htmlFor="Class" className={styles.matLabel}>
              Class
            </label>
            <select
              className={styles.matInput}
              value={
                '{"name":"' +
                this.props.userStore.group_name +
                '","id":"' +
                this.props.userStore.group_id +
                '"}'
              }
              onChange={e => {
                this.props.userStore.ChangeGroup(
                  JSON.parse(e.target.value).name, +JSON.parse(e.target.value).id);
              }}
            >
              {this.state.classOptions.map(group => {
                const optionValue = `{"name":"${group.group_name}","id":"${
                  group.id
                  }"}`;
                return (
                  <option key={group.id} value={optionValue}>
                    {group.group_name}
                  </option>
                );
              })}
            </select>
          </div>
          <div
            className={
              styles.matDiv + ' ' + this.checkHasValue(this.props.userStore.email)
            }
          >
            <label htmlFor="e-mail" className={styles.matLabel}>
              e-mail
            </label>
            <input
              type="email"
              className={styles.matInput}
              value={this.props.userStore.email || ''}
              id="e-mail"
              onChange={e => {
                this.props.userStore.changeEmail(e);
              }}
              onFocus={e => {
                this.setInputActive(e);
              }}
            />
          </div>
          <div
            className={
              styles.matDiv +
              ' ' +
              this.checkHasValue(this.props.userStore.slack_username)
            }
          >
            <label htmlFor="slack-username" className={styles.matLabel}>
              Slack Username
            </label>
            <input
              type="text"
              value={this.props.userStore.slack_username || ''}
              className={styles.matInput}
              id="slack-username"
              onChange={e => {
                this.props.userStore.changeSlackUserName(e);
              }}
              onFocus={e => {
                this.setInputActive(e);
              }}
            />
          </div>
          <div
            className={
              styles.matDiv +
              ' ' +
              this.checkHasValue(this.props.userStore.freecodecamp_username)
            }
          >
            <label htmlFor="freecodecamp-username" className={styles.matLabel}>
              FreeCodeCamp Username
            </label>
            <input
              type="text"
              value={this.props.userStore.freecodecamp_username || ''}
              className={styles.matInput}
              id="freecodecamp-username"
              onChange={e => {
                // store.setState({ freecodecamp_username: e.target.value });
                this.props.userStore.changeCodeCampUserName(e);
              }}
              onFocus={e => {
                this.setInputActive(e);
              }}
            />
          </div>
          <div
            className={
              styles.matDiv + ' ' + this.checkHasValue(this.props.userStore.mobile)
            }
          >
            <label htmlFor="mobile" className={styles.matLabel}>
              Mobile
            </label>
            <input
              type="tel"
              value={this.props.userStore.mobile || ''}
              className={styles.matInput}
              id="mobile"
              onChange={e => {
                this.props.userStore.changeMobile(e);
              }}
              onFocus={e => {
                this.setInputActive(e);
              }}
            />
          </div>
          <Link to="/users">
            <input
              className={styles.saveProfile}
              type="submit"
              value="Save"
              onClick={() => this.props.userStore.saveProfile('loadUsers').catch(errorMessage)}
            />
          </Link>
          <input
            className={styles.resetProfile}
            type="reset"
            value="Reset"
            onClick={this.props.userStore.resetProfile}
          />
        </div>
      </div>
    );
  }
}
