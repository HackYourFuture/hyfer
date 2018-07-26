import React from 'react';
import PropTypes from 'prop-types';
import styles from './users.css';
import { UserList } from './UserList';
import SynchronizeGithubData from './SynchronizeGithubData';
import { inject, observer } from 'mobx-react';

@inject('users')
@observer
export default class UsersPage extends React.Component {
  state = {
    selectedList: '',
  };

  componentWillUnmount() {
    this.props.users.resetUser();
  }

  componentDidMount = () => {
    this.props.users.loadUsers();
    window.scrollTo(0, 0);
  };

  handleFilterList = e => {
    this.setState({
      selectedList: e.target.value,
    });
  };

  renderSelectedList() {
    const { selectedList } = this.state;
    const roles = !selectedList ? ['guest', 'student', 'teacher'] : [selectedList];

    return roles.map(role => {
      return (
        <ul key={role} className={styles.mainUl}>
          <UserList role={role} />
        </ul>
      );
    });
  }

  render() {
    return (
      <div>
        <div className={styles.userSearchDiv}>
          <input
            className={styles.userSearchBox}
            type="text"
            placeholder="lookup someone"
            onChange={this.props.users.searchUser}
          />
          <select
            className={styles.listSelector}
            value={this.state.selectedList}
            onChange={e => {
              this.handleFilterList(e);
            }}
          >
            <option value="">All list</option>
            <option value="guest">Guest</option>
            <option value="teacher">Teachers</option>
            <option value="student">Students</option>
          </select>
          <SynchronizeGithubData />
        </div>
        <div>{this.renderSelectedList()}</div>
      </div>
    );
  }
}

UsersPage.wrappedComponent.propTypes = {
  users: PropTypes.object.isRequired,
};
