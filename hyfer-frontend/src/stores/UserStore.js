import { fetchJSON } from './util';
import { observable, action, runInAction } from 'mobx';
import stores from '.';

export default class UserStore {

  @observable
  filteredUsers = [];

  @observable
  userProfile = {};

  @observable
  resetProfile = {};

  @observable
  teachers = [];

  @observable
  assignedTeachers = [];

  users = [];

  @action
  async loadUsers() {
    try {
      const users = await fetchJSON('/api/user/all');
      runInAction(() => {
        this.filteredUsers = users;
        this.users = users;
      });
    } catch (err) {
      stores.notification.reportError(err);
    }
  }

  @action
  async getTeachers() {
    try {
      const teachers = await fetchJSON('/api/user/teachers');
      runInAction(() => {
        return this.teachers = teachers;
      });
    } catch (err) {
      stores.notification.reportError(err);
    }
  }

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
    runInAction(() => {
      this.filteredUsers = updatedList;
    });
  };

  @action
  getUserProfileInfo = (user) => {
    runInAction(() => {
      this.userProfile = user;
      this.resetProfile = user;
    });
  };

  @action
  resetUserProfile = () => {
    runInAction(() => {
      this.userProfile = {};
      this.resetProfile = {};
    });
  }

  @action
  resetUser = () => {
    runInAction(() => {
      this.filteredUsers = [];
      this.users = [];
    });
  }
}
