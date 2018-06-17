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
    return this.currentUser != null && this.currentUser.role === 'student';
  }

  @computed
  get isTeacher() {
    return this.currentUser != null && this.currentUser.role === 'teacher';
  }

  @action
  setLastError(error) {
    this.lastError = error;
  }

  @action
  clearError() {
    this.lastError = null;
  }

  @action
  fetchCurrentUser() {
    fetchJSON('/api/user')
      .then((res) => {
        runInAction(() => this.currentUser = res);
      })
      .catch((error) => this.setLastError(error));
  }
}
