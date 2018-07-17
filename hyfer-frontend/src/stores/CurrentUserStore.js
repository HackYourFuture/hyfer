import { action, computed, observable, runInAction } from 'mobx';
import { fetchJSON } from './util';
import stores from './';

export default class GlobalStore {

  isLoaded = false;

  @observable
  currentUser = {
    role: 'guest',
  };

  @computed
  get id() {
    return this.currentUser.id;
  }

  @computed
  get userName() {
    return this.currentUser.username;
  }

  @computed
  get role() {
    return this.currentUser.role;
  }

  @computed
  get isLoggedIn() {
    return this.currentUser.role !== 'guest';
  }

  @computed
  get isStudent() {
    return this.currentUser.role === 'student';
  }

  @computed
  get isTeacher() {
    return this.currentUser.role === 'teacher';
  }

  @computed
  get avatarUrl() {
    return `https://avatars.githubusercontent.com/${this.currentUser.username}`;
  }

  @computed
  get isArchived() {
    return this.currentUser.archived === 1;
  }

  @computed
  get fullName() {
    return this.currentUser.full_name;
  }

  @computed
  get email() {
    return this.currentUser.email;
  }

  @computed
  get linkedInName() {
    return this.currentUser.linkedin_username;
  }

  @computed
  get groupName() {
    return this.currentUser.group_name;
  }

  @computed
  get registerDate() {
    return this.currentUser.register_date;
  }

  @action
  fetchUser = () => {
    if (this.isLoaded) {
      return;
    }
    fetchJSON('/api/user')
      .then((res) => {
        runInAction(() => {
          this.isLoaded = true;
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
