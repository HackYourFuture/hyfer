import React, { Component } from 'react';
// import store from '../../store/UserStore';
import styles from '../../assets/styles/profile.css';
import { Link } from 'react-router-dom';
import { errorMessage } from '../../notify';

class userAccount extends Component {

  setInputActive = e => {
    e.target.parentElement.className += ' ' + styles.isActive;
    e.target.parentElement.className += ' ' + styles.isCompleted;
  };

  componentWillUnmount() {
    // this.subscription.remove();
  
  }

  componentDidMount() {
    // this.subscription = store.subscribe(state => {
    //   this.setState(state);
    // });
    window.scrollTo(0, 0);
  }

  checkHasValue(val) {
    return !val || val.length === 0 ? '' : styles.isCompleted;
  }

  render() {
    return (
      <div className={styles.profilePage}>
        <Link to="/currentUserProfile">
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
                // store.setState({ full_name: e.target.value });
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
            <input
              type="text"
              className={styles.matInput}
              value={this.props.userStore.role}
              disabled="true"
            />
          </div>

          <div
            className={
              styles.small + ' ' + styles.matDiv + ' ' + styles.isCompleted
            }
          >
            <label htmlFor="Class" className={styles.matLabel}>
              Class
            </label>
            <input
              type="text"
              className={styles.matInput}
              value={this.props.userStore.group_name}
              disabled="true"
            />
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
                // store.setState({ email: e.target.value });
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
                // store.setState({ slack_username: e.target.value });
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
                // store.setState({ mobile: e.target.value });
                this.props.userStore.changeMobile(e);                
              }}
              onFocus={e => {
                this.setInputActive(e);
              }}
            />
          </div>
          <Link to="/currentUserProfile">
            <input
              className={styles.saveProfile}
              type="submit"
              value="Save"
              onClick={() => this.props.userStore.saveProfile('loadUser').catch(errorMessage)}
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

export default userAccount;
