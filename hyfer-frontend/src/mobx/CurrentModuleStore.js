import { observable, runInAction, action } from 'mobx';
import { fetchJSON } from './util';
import marked from 'marked';
import stores from '.';

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

  @observable
  readme = null;

  @observable
  group = null;

  @observable
  module = null;

  @observable
  currentModule = null;

  @observable
  students = [];

  @observable
  teachers = [];

  async getRunningModuleDetails(runningId) {
    const details = await fetchJSON(`/api/running/details/${runningId}`);
    runInAction(() => {
      const { group, module, runningModule, students, teachers } = details;
      this.group = group;
      this.module = module;
      this.currentModule = runningModule;
      this.students = students;
      this.teachers = teachers;
    });
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

  saveNotes = async (notes) => {
    try {
      if (!this.currentModule) {
        throw new Error('Cannot save notes: no current module set.');
      }
      const runningId = this.currentModule.id;
      await fetchJSON(`/api/running/notes/${runningId}`, 'PATCH', { notes });
    } catch (err) {
      stores.global.setLastError(err);
    }
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
    const html = marked(readmeDecoded);

    runInAction(() => {
      this.readme = { repoName, html };
    });
  }
  @action
  async fetchCurrentModuleUsers(group_name) {
    const token = localStorage.getItem('token');
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/user/currentuser/${group_name}`
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
        return this.students = moduelUsers;
      });

    }
  }

}
