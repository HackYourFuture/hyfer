import { action, computed, observable, runInAction } from 'mobx';
import { fetchJSON } from './util';
import stores from './';
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
  @computed
  get isArchived() {
    return this.isLoggedIn && this.currentUser.archived === 1;
  }

  @action
  setLastError = (error) => { this.lastError = error; };

  @action
  clearLastError = () => this.lastError = null;

  @action
  setSuccessMessage = (message) => this.successMessage = message;

  @action
  clearSuccessMessage = () => this.successMessage = null;

  @action
  setWarningMessage = (warning) => this.warningMessage = warning;

  @action
  clearWarningMessage = () => this.warningMessage = null;

  @action
  fetchCurrentUser = () => {
    if (this.currentUser) {
      return;
    }
    fetchJSON('/api/user')
      .then((res) => {
        runInAction(() => {
          this.currentUser = res;
          if (this.currentUser.group_name !== null && this.isStudent && !this.isArchived) {
            stores.currentModuleStore.getGroupsByGroupName(this.currentUser.group_name);
          }
        });
      })
      .catch((error) => this.setLastError(error));
  }

  @action
  updateCurrentUser = async (email, linkedInName) => {
    const { id } = this.currentUser;
    if (!email && !linkedInName) {
      return;
    }

    const updates = {};
    if (email) {
      updates.email = email;
    }
    if (linkedInName) {
      updates.linkedInName = linkedInName;
    }

    try {
      await fetchJSON(`/api/user/${id}`, 'PATCH', updates);
    } catch (error) {
      this.setLastError(error);
    }
  }
}
