import { action, computed, observable, runInAction } from 'mobx';
import { fetchJSON } from './util';
import stores from './';

export default class GlobalStore {

  @observable
  currentUser = null;

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
  fetchCurrentUser = () => {
    if (this.currentUser) {
      return;
    }
    fetchJSON('/api/user')
      .then((res) => {
        runInAction(() => {
          this.currentUser = res;
          const { group_name: groupName } = this.currentUser;
          if (groupName != null && this.isStudent && !this.isArchived) {
            stores.currentModuleStore.getGroupsByGroupName(groupName);
            stores.timeline.setFilter(groupName);
          }
        });
      })
      .catch((error) => stores.ui.setLastError(error));
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
      stores.ui.setLastError(error);
    }
  }
}
