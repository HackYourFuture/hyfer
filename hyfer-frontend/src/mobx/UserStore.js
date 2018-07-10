import { fetchJSON } from './util';
import { observable, action, runInAction } from 'mobx';
import stores from '.';

const token = localStorage.getItem('token');

export default class UserStore {

  @observable
  filteredUsers = [];

  @observable
  userProfile = {};

  @observable
  resetProfile = {};

  @observable
  teachers = [];

  users = [];

  @action
  async loadUsers() {
    const users = await fetchJSON('/user/all');
    runInAction(() => {
      this.filteredUsers = users;
      this.users = users;
    });
    return;
  }

  @action
  async getTeacher() {
    const res = await fetch(`http://localhost:3005/api/user/teachers/`
      , {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },

      });
    if (!res.ok) {
      stores.global.setLastError(res);

    } else {
      const response = await res.json();
      runInAction(() => {
        return this.teachers = response;
      });
    }

  }

  // @action
  // async getRunningModuleTeachers(groupsId) {
  //   const res = await fetch(`http://localhost:3005/api/user/teachers/${groupsId}`
  //     , {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: 'Bearer ' + token,
  //       },

  //     });
  //   if (!res.ok) {
  //     stores.global.setLastError(res);

  //   } else {
  //     const response = await res.json();
  //     runInAction(() => {
  //       return this.teachers = response;
  //     });
  //   }

  // }


  @action
  saveProfile = async (Data, loadData) => {
    const res = await fetch(`http://localhost:3005/api/user/${this.userProfile.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(Data),
    });
  
    if (loadData === 'loadUsers') {
      this.loadUsers(); // this error handling is propagated
    } else if (loadData === 'loadUser') {
      stores.global.fetchCurrentUser();
    }
    // throwing it in the end of the file because of the loading if it does happen an error the loading will be blocked
    if (!res.ok) {
      stores.global.setLastError(res);
    }
    else {
      stores.global.setSuccessMessage('Your changes have been successfully saved!');
    }
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

