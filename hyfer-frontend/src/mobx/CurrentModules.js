import { action, observable, runInAction } from 'mobx';
import moment from 'moment';
import stores from './';
export default class CurrentModules {

  @observable
  moduleUsers = [];

  @observable
  currentModule = [];

  @observable
  teachers = [];


  @action
  async fetchCurrentModuleUsers(group_id) {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:3005/api/user/currentuser/${group_id}`
      , {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },

      });

    if (!res.ok) {
      runInAction(() => {
        stores.global.setLastError(res);

      });
    } else {
      const response = await res.json();
      const moduelUsers = response;
      runInAction(() => {
        return this.moduleUsers = moduelUsers;
      });

    }
  }

  @action
  async getGroupsByGroupName(group_name) {
    const token = localStorage.getItem('token');
    const groupName = group_name.replace(' ', '');
    const res = await fetch(`http://localhost:3005/api/groups/currentgroups/${groupName}`
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
      const runningModules = response;
      let computedDate = moment(runningModules[0].starting_date);
      const currentDate = moment();
      let index = 0;
      for (; index < runningModules.length; index++) {
        const runningModule = runningModules[index];
        const { duration } = runningModule;
        computedDate = computedDate.add(duration, 'weeks');

        if (computedDate > currentDate) {
          break;
        }
      }
      runInAction(() => {
        this.currentModule = response[index];
      });
    }
  }

  @action
  async fetchModuleTeachers(id) {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:3005/api/user/teachers/${id}`
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
}
