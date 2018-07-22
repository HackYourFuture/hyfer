import { action, computed, observable, runInAction } from 'mobx';
import { fetchJSON } from './util';
import stores from './';

const profileKeyMap = {
  linkedInName: 'linkedin_username',
  email: 'email',
  notes: 'notes',
};

export default class GlobalStore {

  isLoaded = false;

  @observable
  user = {
    role: 'guest',
  };

  @observable
  profile = null;

  @computed
  get id() {
    return this.user.id;
  }

  @computed
  get userName() {
    return this.user.username;
  }

  @computed
  get role() {
    return this.user.role;
  }

  @computed
  get isLoggedIn() {
    return this.user.role !== 'guest';
  }

  @computed
  get isStudent() {
    return this.user.role === 'student';
  }

  @computed
  get isTeacher() {
    return this.user.role === 'teacher';
  }

  @computed
  get avatarUrl() {
    return `https://avatars.githubusercontent.com/${this.user.username}`;
  }

  @computed
  get isArchived() {
    return this.user.archived === 1;
  }

  @computed
  get fullName() {
    return this.user.full_name;
  }


  @computed
  get groupName() {
    return this.user.group_name;
  }

  @computed
  get registerDate() {
    return this.user.register_date;
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
  get notes() {
    return this.profile.notes;
  }

  @action
  fetchUser = async () => {
    if (this.isLoaded) {
      return;
    }
    try {
      const res = await fetchJSON('/api/user');
      runInAction(() => {
        this.isLoaded = true;
        this.user = res;
        this.profile = res;
      });
    } catch (err) {
      stores.uiStore.setLastError(err);
    }
  }

  @action
  updateCurrentUser = async (profile) => {
    const { id } = this.user;

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
      runInAction(() => this.profile = res);
    } catch (error) {
      stores.uiStore.setLastError(error);
    }
  }
}
