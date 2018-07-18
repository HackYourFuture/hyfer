import { observable, runInAction, action } from 'mobx';
import { fetchJSON } from './util';
import Showdown from 'showdown';
import stores from '.';
import moment from "moment";

const HYF_GITHUB_URL = 'https://api.github.com/repos/HackYourFuture';

function getSundays(start, end) {
  const allSundays = [];
  while (start.day(0).isBefore(end)) {
    allSundays.push(start.clone().format('YYYY/MM/DD'));
    start.add(1, 'weeks');
  }
  return allSundays;
}

export default class CurrentModuleStore {

  converter = new Showdown.Converter({ tables: true, simplifiedAutoLink: true });

  @observable
  readme = null;

  @observable
  group = [];

  @observable
  module = [];

  @observable
  currentModule = null;

  @observable
  students = [];

  @observable
  teachers = [];

  @observable
  history = "";

  @observable
  currentWeek = "";

  @observable
  aantalWeeks = [];

  async getRunningModuleDetails(runningId) {
    const details = await fetchJSON(`/api/running/details/${runningId}`);
    runInAction(() => {
      const { group, module, runningModule, students, teachers } = details;
      this.group = group;
      this.module = module;
      this.currentModule = runningModule;
      this.students = students;
      this.teachers = teachers;
      this.history = students.history;
      this.aantalWeeks = new Array(runningModule.duration);
    });
  }

  addTeacher = async (moduleId, teacherId) => {
    try {
      const teachers = await fetchJSON(`/api/running/teacher/${moduleId}/${teacherId}`, 'POST');
      runInAction(() => this.teachers = teachers);
    } catch (err) {
      stores.global.setLastError(err);
    }
  }

  deleteTeacher = async (moduleId, userId) => {
    try {
      const teachers = await fetchJSON(`/api/running/teacher/${moduleId}/${userId}`, 'DELETE');
      runInAction(() => this.teachers = teachers);
    } catch (err) {
      stores.global.setLastError(err);
    }
  }

  saveNotes = async (notes) => {
    try {
      if (!this.currentModule) {
        throw new Error('Cannot save notes: no current module set.');
      }
      const runningId = this.currentModule.id;
      const runningModule = await fetchJSON(`/api/running/notes/${runningId}`, 'PATCH', { notes });
      runInAction(() => this.currentModule = runningModule);
    } catch (err) {
      stores.global.setLastError(err);
    }
  }

  getHistory = async (runningModule) => {
    this.currentModule = runningModule;
    this.getReadme(this.currentModule && this.currentModule.git_repo);

    if (!stores.global.isTeacher) {
      return;
    }

    const {
      running_module_id,
      id: group_id,
      starting_date,
      ending_date,
    } = runningModule;

    const moduleSundays = getSundays(starting_date, ending_date);
    const sundays = { sundays: moduleSundays };

    const token = localStorage.getItem('token');
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/history/${running_module_id}/${group_id}`, {
      method: 'PATCH',
      body: JSON.stringify(sundays),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    });
    if (!res.ok) throw res;
    const response = await res.json();

    runInAction(() => {
      this.history = response;
    });
  }

  getReadme = async (repoName) => {
    if (!repoName) {
      this.readme = null;
      return;
    }
    const res = await fetch(`${HYF_GITHUB_URL}/${repoName}/readme`);
    if (!res.ok) throw res;
    const readmeEncoded = await res.json();
    const readmeDecoded = atob(readmeEncoded.content);
    const html = this.converter.makeHtml(readmeDecoded);
    runInAction(() => {
      this.readme = { repoName, html };
    });
  }

  async getGroupsByGroupName(group_name, update) {
    const token = localStorage.getItem('token');
    const groupName = group_name.replace(' ', '');
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/groups/currentgroups/${groupName}`
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
        if (computedDate > currentDate) {
          break;
        }
        const runningModule = runningModules[index];
        const { duration } = runningModule;
        computedDate = computedDate.add(duration, 'weeks');

      }
      if (update) {
        runInAction(() => {
          if (computedDate < currentDate) {
            this.getRunningModuleDetails(response[index].id);
            const date = computedDate.diff(currentDate, "weeks");
            const start = response[index].duration - date;
            this.currentWeek = start;
          }
        });
      } else {
        runInAction(() => {
          if (computedDate < currentDate) {
            const date = computedDate.diff(currentDate, "weeks");
            const start = response[index].duration - date;
            this.currentWeek = start;
          }

        });
      }

    }
  }

  @action
  saveAttendance = async (user_id, week_num, attendance, homework) => {
    this.getGroupsByGroupName(this.group.group_name, false);
    if (week_num > this.currentWeek) {
      stores.global.setWarningMessage(" you can not take the attendance for this week");
    } else {
      const token = localStorage.getItem('token');
      const data = {
        running_module_id: this.currentModule.id,
        user_id: user_id,
        week_num: week_num,
        attendance: attendance,
        homework: homework,
      };
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/history/test`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        method: "POST",
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        stores.global.setLastError(res);
      } else {
        this.getRunningModuleDetails(data.running_module_id);
        stores.global.setSuccessMessage("saved");
      }
    }
  }
}
