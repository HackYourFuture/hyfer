import { action, computed, observable, runInAction } from 'mobx';
import { fetchJSON } from './util';

export default class GlobalStore {

  @observable
  currentUser = null;

  @observable
  lastError = null;

  @observable
  successMessage = null;

  @observable
  warningMessage = null;

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

  @action.bound
  setLastError(error) {
    this.lastError = error;
  }

  @action.bound
  clearLastError() {
    this.lastError = null;
  }

  @action.bound
  setSuccessMessage(message) {
    this.successMessage = message;
  }

  @action.bound
  clearSuccessMessage() {
    this.successMessage = null;
  }

  @action.bound
  setWarningMessage(warning) {
    this.warningMessage = warning;
  }

  @action.bound
  clearWarningMessage() {
    this.warningMessage = null;
  }

  @action.bound
  fetchCurrentUser() {
    fetchJSON('/user')
      .then((res) => {
        runInAction(() => this.currentUser = res);
      })
      .catch((error) => this.setLastError(error));
  }
}
