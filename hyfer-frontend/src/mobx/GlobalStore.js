import { action, computed, observable, runInAction } from 'mobx';
import { fetchJSON } from './util';


export default class GlobalStore {

  @observable
  currentUser = null;

  @observable
  lastError = null;

  @computed
  get isLoggedIn() {
    return this.currentUser != null;
  }

  @computed
  get isStudent() {
    return this.isLoggedIn && this.currentUser.role === 'student';
  }

  @computed
  get isTeacher() {
    return this.isLoggedIn && this.currentUser.role === 'teacher';
  }

  @computed
  get avatarUrl() {
    return this.isLoggedIn ? `https://avatars.githubusercontent.com/${this.currentUser.username}` : null;
  }

  @action
  setLastError(error) {
    this.lastError = error;
  }

  @action
  clearLastError() {
    this.lastError = null;
  }

  @action
  fetchCurrentUser() {
    this.clearLastError();
    fetchJSON('/api/user')
      .then((res) => {
        runInAction(() => this.currentUser = res);
      })
      .catch((error) => this.setLastError(error));
  }
}
