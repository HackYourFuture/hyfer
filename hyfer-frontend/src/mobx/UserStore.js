import { success } from '../notify';
import { fetchJSON } from './util';
import { observable, action, runInAction} from 'mobx';

const token = localStorage.getItem('token');

class UserStore {

  @observable
  currentUser = '';

  @observable
  users = [];

  @observable
  filteredUsers = [];

  @observable
  id = [];

  @observable
  username = [];

  @observable
  full_name = [];

  @observable
  group_name = [];

  @observable
  role = [];

  @observable
  register_date = [];

  @observable
  email = [];

  @observable
  slack_username = [];

  @observable
  freecodecamp_username = [];
  @observable
  mobile = [];

  @observable
  group_id = [];

  @observable
  reset_id = [];

  @observable
  reset_username = [];

  @observable
  reset_full_name = [];

  @observable
  reset_group_name = [];

  @observable
  reset_role = [];

  @observable
  reset_register_date = [];

  @observable
  reset_email = [];

  @observable
  reset_slack_username = [];

  @observable
  reset_freecodecamp_username = [];

  @observable
  reset_mobile = [];

  @observable
  reset_group_id = [];

  @observable
  mobileActive = false;

  @observable
  slackActive = false;
  
  @action
  async loadUser() {
    const data = await fetchJSON('/api/user');
    return this.currentUser = data;
  }

  @action
  async loadUsers() {
    const users = await fetchJSON('/api/user/all');
    // this.users = users;
    runInAction(() => {
      this.filteredUsers = users;
      this.users = users;
    });
    return;
  }

  @action
  saveProfile = async loadData => {
    const updatedUser = {
      id: this.id,
      username: this.username,
      full_name: this.full_name,
      group_name: this.group_name,
      role: this.role,
      register_date: this.register_date,
      email: this.email,
      slack_username: this.slack_username,
      freecodecamp_username: this.freecodecamp_username,
      mobile: this.mobile,
      group_id: this.group_id,
    };
    const res = await fetch(`http://localhost:3005/api/user/${this.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(updatedUser),
    });
    if (loadData === 'loadUser') {
      this.loadUser(); // this error handling is propagated
    } else if (loadData === 'loadUsers') {
      this.loadUsers(); // this error handling is propagated
    }
    // throwing it in the end of the file because of the loading if it does happen an error the loading will be blocked
    if (!res.ok) throw res;
    else success('Success saving profile changes');
  };
  @action
  resetProfile = () => {
    this.id = this.reset_id;
    this.username = this.reset_username;
    this.full_name = this.reset_full_name;
    this.group_name = this.reset_group_name;
    this.role = this.reset_role;
    this.register_date = this.reset_register_date;
    this.email = this.reset_email;
    this.slack_username = this.reset_slack_username;
    this.freecodecamp_username = this.reset_freecodecamp_username;
    this.mobile = this.reset_mobile;
    this.group_id = this.reset_group_id;
  };
  @action
  searchUser = event => {
    let updatedList = this.users;
    updatedList = updatedList.filter(item => {
      return (
        item.full_name
          .toLowerCase()
          .search(event.target.value.toLowerCase()) !== -1
      );
    });
    this.filteredUsers = updatedList;
  };
  @action
  changeFullName = (e) => {
    this.full_name = e.target.value;
  }
  @action
  changeRole = (e) => {
    this.role = e.target.value;
  }
  @action
  ChangeGroup = (group_name, group_id) => {
    this.group_name = group_name;
    this.group_id = group_id;
  }
  @action
  changeEmail = (e) => {
    this.email = e.target.value;
  }
  @action
  changeSlackUserName = (e) => {
    this.slack_username = e.target.value;
  }
  @action
  changeCodeCampUserName = (e) => {
    this.freecodecamp_username = e.target.value;
  }
  @action
  changeMobile = (e) => {
    this.mobile = e.target.value;
  }
  @action
  ChangeMobileActive = () => {
    this.mobileActive = !this.mobileActive;
  }
  @action
  setState = (user) => {
    this.id = user.id;
    this.username = user.username;
    this.full_name = user.full_name;
    this.group_name = user.group_name;
    this.role = user.role;
    this.register_date = user.register_date;
    this.email = user.email;
    this.slack_username = user.slack_username;
    this.freecodecamp_username = user.freecodecamp_username;
    this.mobile = user.mobile;
    this.group_id = user.group_id;

    this.reset_id = user.id;
    this.reset_username = user.username;
    this.reset_full_name = user.full_name;
    this.reset_group_name = user.group_name;
    this.reset_role = user.role;
    this.reset_register_date = user.register_date;
    this.reset_email = user.email;
    this.reset_slack_username = user.slack_username;
    this.reset_freecodecamp_username = user.reset_freecodecamp_username;
    this.freecodecamp_username = user.freecodecamp_username;
    this.reset_mobile = user.mobile;
    this.reset_group_id = user.group_id;

  }
}

export default UserStore;
