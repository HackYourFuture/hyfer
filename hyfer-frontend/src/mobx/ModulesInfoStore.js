import { action, observable, runInAction } from 'mobx';
import marked from 'marked';
import moment from 'moment';
import stores from '.';

const BASE_URL = 'https://api.github.com/repos/HackYourFuture';


export default class ModulesInfoStore {
  
  @observable
  readme = null;

  @observable
  repoName = null;

  @observable
  history = null;

  @observable
  students = null;

  @observable
  group_name = null;

  @observable
  group_id = null;

  @observable
  group = null;

  @observable
  running_module_id = null;

  @observable
  duration = null;

  @observable
  start = null;

  @observable
  end = null;

  @action.bound
  async defaultReadme(defaultRepo) {
      const res = await fetch(`${BASE_URL}/${defaultRepo}/readme`);
      if (!res.ok) throw res;
      const readmeEncoded = await res.json();
      const readmeDecoded = atob(readmeEncoded.content);
      const readmeHtml = marked(readmeDecoded);
      runInAction(() => {
        this.readme = readmeHtml;
        this.repoName = defaultRepo;
      });
  }

  @action.bound
  async getHistory (clickEvent){
    // the error is propagated
    // used once in src\Pages\Timeline\TimeLine.js
    if (!stores.global.isTeacher) {
      this.getRepoNameAndSundays(clickEvent);
      return this.getReadme();
    }
    this.getRepoNameAndSundays(clickEvent);
    this.getReadme();
    const moduleSundays = this.getSundays(this.start, this.end);
    const sundays = {
      sundays: moduleSundays,
    };
    const token = localStorage.getItem('token');
    const BASE_URL = 'http://localhost:3005/api/history';
    const res = await fetch(`${BASE_URL}/${this.running_module_id}/${this.group_id}`, {
      method: 'PATCH',
      body: JSON.stringify(sundays),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    });
    if (!res.ok) throw res;
    const response = await res.json();
    const students = Object.keys(response);
    runInAction(() => {
        this.history = response;
        this.students = students;
    });
  }

  async getReadme() {
    // check if there is a valid repoName
    if (!this.repoName || this.repoName === 'NOREPO') return;
    // make the request
    const res = await fetch(`${BASE_URL}/${this.repoName}/readme`);
    if (!res.ok) throw res; // the error is propagated
    const readmeEncoded = await res.json();
    const readmeDecoded = atob(readmeEncoded.content);
    const readmeHtml = marked(readmeDecoded);
    runInAction(() => {
      this.readme = readmeHtml;
    });
  }
  @action.bound
  getSundays(startString, endString){
    // note: not passing just a string because moment is throwing a warning about the format of the string
    const start = moment(new Date(startString));
    const end = moment(new Date(endString));
    const allSundays = [];
    while (start.day(0).isBefore(end)) {
      allSundays.push(start.clone().format('YYYY/MM/DD'));
      start.add(1, 'weeks');
    }
    return allSundays;
  }

  @action.bound
  getRepoNameAndSundays(clickEvent){
    this.repoName = null;
    const target = clickEvent.target;
    const dataset = target.dataset;
    const {
      start,
      end,
      repo,
      group_id,
      group,
      running_module_id,
      duration,
    } = dataset;

    if (!repo) {
      this.repoName = 'NOREPO';
      this.readme = '';
    } else {
      this.repoName = repo;
      this.group_id = group_id;
      this.running_module_id = running_module_id;
      this.duration = duration;
      this.start = start;
      this.end = end;
      this.group = group;
    }
  }
}
