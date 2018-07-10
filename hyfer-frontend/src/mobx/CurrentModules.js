import { action, observable, runInAction } from 'mobx';
import moment from 'moment';
import stores from './';
const token = localStorage.getItem('token');
export default class CurrentModules {

  @observable
  moduleUsers = [];

  @observable
  currentModule = [];

  @observable
  teachers = [];

  @observable
  endingDate = '';

  @observable
  moduleWeeks = '';

  @observable
  weeksAntaal = [];

  // @observable
  // weekNumer = '';

  @action
  async fetchCurrentModuleUsers(group_id) {
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
        this.fetchModuleTeachers(response[index].id);
        const start = computedDate.subtract(response[index].duration + 1, 'weeks');
        const weeks = currentDate.diff(start, 'weeks');
        this.moduleWeeks = weeks;
        this.weeksAntaal = Array(weeks);
      });

    }
  }


  @action
  async fetchModuleTeachers(id) {
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
  @action
  async getModuleInfo(module_id) {
    const res = await fetch(`http://localhost:3005/api/running/runningmodule/${module_id}`
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
      const currentRunningModule = response;
      // let computedDate = moment(currentRunningModule.starting_date);// here i am get the starting for the
      // const currentDate = moment();
      // if (computedDate > currentDate) {
      //   stores.global.setLastError('weeks');
      // } else {
      // const { duration } = currentRunningModule;
      // computedDate = computedDate.add(duration, 'weeks');
      runInAction(() => {
        this.currentModule = currentRunningModule;
        // const start = computedDate.subtract(response.duration + 1, 'weeks');
        // const weeks = currentDate.diff(start, 'weeks');
        // this.moduleWeeks = duration;
        this.weeksAntaal = Array(currentRunningModule[0].duration);
      });
    }
  }
  // }
}
