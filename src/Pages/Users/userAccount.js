import React, { Component } from 'react'
import store from '../../store/UserStore';
import styles from '../../assets/styles/profile.css';
import { Link } from 'react-router-dom';
import Notifications from 'react-notify-toast';

class userAccount extends Component {
  
  componentWillMount = () => {
    this.subscription = store.subscribe(state => {
      this.setState(state);
    });
  }

  setInputActive = (e) => {
    e.target.parentElement.className += ' ' + styles.isActive
    e.target.parentElement.className += ' ' + styles.isCompleted
  }

  componentWillUnmount() {
    this.subscription.remove();
  }

  componentDidMount() {
    window.scrollTo(0, 0)
  }
  checkHasValue(val) {
    return (!val || val.length === 0) ? '' : styles.isCompleted;
  }
  
  render() {
    return (
      <div className={styles.profilePage}>
        <Notifications />
        <Link to='/currentUserProfile'>
          <input className={styles.backButton}
            type="button"
            value="&#8249;"
          />
        </Link>
        <h1>Edit Profile</h1>
        <div className={styles.profileContainer}>
          <div className={styles.matDiv + ' ' + this.checkHasValue(store.state.full_name)}>
            <label htmlFor="first-name" className={styles.matLabel}>First Name</label>
            <input className={styles.matInput}
              type="text" value={store.state.full_name}
              id="first-name"
              onChange={(e) => { store.setState({ full_name: e.target.value });}}
              onFocus={(e) => { this.setInputActive(e) }}
            />
          </div>

          <div className={styles.small + ' ' + styles.matDiv + ' ' + styles.isCompleted}>
            <label htmlFor="role" className={styles.matLabel}>Role</label>
            <input type="text"
              className={styles.matInput}
              value={store.state.role}
              disabled='true' />
          </div>

          <div className={styles.small + ' ' + styles.matDiv + ' ' + styles.isCompleted}>
            <label htmlFor="Class" className={styles.matLabel}>Class</label>
            <input type="text"
              className={styles.matInput}
              value={store.state.group_name}
              disabled='true'/>
          </div>
          <div className={styles.matDiv + ' ' + this.checkHasValue(store.state.email)}>
            <label htmlFor="e-mail" className={styles.matLabel}>e-mail</label>
            <input type="email"
              className={styles.matInput}
              value={store.state.email || ''}
              id="e-mail"
              onChange={(e) => { store.setState({ email: e.target.value }); }}
              onFocus={(e) => { this.setInputActive(e) }} />
          </div>
          <div className={styles.matDiv + ' ' + this.checkHasValue(store.state.slack_username)}>
            <label htmlFor="slack-username" className={styles.matLabel}>Slack Username</label>
            <input type="text"
              value={store.state.slack_username || ''}
              className={styles.matInput}
              id="slack-username"
              onChange={(e) => { store.setState({ slack_username: e.target.value }); }}
              onFocus={(e) => { this.setInputActive(e) }}
            />
          </div>
          <div className={styles.matDiv + ' ' + this.checkHasValue(store.state.freecodecamp_username)}>
            <label htmlFor="freecodecamp-username" className={styles.matLabel}>FreeCodeCamp Username</label>
            <input type="text"
              value={store.state.freecodecamp_username || ''}
              className={styles.matInput}
              id="freecodecamp-username"
              onChange={(e) => { store.setState({ freecodecamp_username: e.target.value }); }}
              onFocus={(e) => { this.setInputActive(e) }}
            />
          </div>
          <div className={styles.matDiv + ' ' + this.checkHasValue(store.state.mobile)}>
            <label htmlFor="mobile" className={styles.matLabel}>Mobile</label>
            <input type="tel"
              value={store.state.mobile || ''}
              className={styles.matInput}
              id="mobile"
              onChange={(e) => { store.setState({ mobile: e.target.value }); }}
              onFocus={(e) => { this.setInputActive(e) }}
            />
          </div>
          <Link to='/currentUserProfile'>
            <input className={styles.saveProfile}
              type="submit"
              value="Save"
              onClick={() => store.saveProfile('loadUser')}
            />
          </Link>
          <input className={styles.resetProfile}
            type="reset"
            value="Reset"
            onClick={store.resetProfile}
          />
        </div>

      </div>
    )
  }
}

export default userAccount
