// currentUser
// users
// filteredUsers

import { action, observable, runInAction } from 'mobx';
import { fetchJSON } from './util';

export default class UserStore {

  @observable
  currentUser = null;

  @observable
  error = false;

  @action
  loadUser() {
    fetchJSON('/api/user')
      .then((res) => {
        runInAction(() => this.currentUser = res);
      })
      .catch((error) => {
        runInAction(() => this.error = error);
      });
  }
}
