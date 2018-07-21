import { action, computed, observable, runInAction } from 'mobx';
import { fetchJSON } from './util';
import stores from './';

const profileKeyMap = {
  linkedInName: 'linkedin_username',
  email: 'email',
  bio: 'bio',
};

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
  get groupName() {
    return this.currentUser.group_name;
  }

  @computed
  get registerDate() {
    return this.currentUser.register_date;
  }

  @computed
  get email() {
    return this.profile.email;
  }

  @computed
  get linkedInName() {
    return this.profile.linkedin_username;
  }

  @computed
  get bio() {
    return this.profile.bio;
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
          this.profile = res;
          const { group_name: groupName } = this.currentUser;
          if (groupName != null && this.isStudent && !this.isArchived) {
            stores.currentModuleStore.getGroupsByGroupName(groupName, true);
            stores.timeline.setFilter(groupName);
          }
        });
      })
      .catch((error) => stores.ui.setLastError(error));
  }

  @action
  updateCurrentUser = async (profile) => {
    const { id } = this.currentUser;

    const updates = Object.keys(profile)
      .reduce((acc, key) => {
        const value = profile[key];
        if (typeof value === 'string') {
          const dbKey = profileKeyMap[key];
          acc[dbKey] = value.trim();
        }
        return acc;
      }, {});

    try {
      const res = await fetchJSON(`/api/user/${id}`, 'PATCH', updates);
      runInAction(() => {
        this.currentUser = res;
      });
    } catch (error) {
      stores.ui.setLastError(error);
    }
  }
}
