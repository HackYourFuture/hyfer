import { observable, action, runInAction } from 'mobx';
import { fetchJSON } from './util';
import Showdown from 'showdown';
import stores from '.';
import moment from "moment";

const HYF_GITHUB_URL = 'https://api.github.com/repos/HackYourFuture';

function normalizeHistory(duration, history) {
  const normalized = [];
  for (let weekNum = 0; weekNum < duration; weekNum += 1) {
    const weekData = history.find(item => item.week_num === weekNum);
    normalized.push({
      attendance: weekData ? weekData.attendance : 0,
      homework: weekData ? weekData.homework : 0,
    });
  }
  return normalized;
}

export default class CurrentModuleStore {

  converter = new Showdown.Converter({ tables: true, simplifiedAutoLink: true });

  @observable
  readme = null;

  @observable
  group = [];

  @observable
  module = null;

  @observable
  currentModule = null;

  @observable
  students = [];

  @observable
  teachers = [];

  @observable
  currentWeek = null;

  @action
  async getRunningModuleDetails(runningId) {
    const details = await fetchJSON(`/api/running/details/${runningId}`);
    stores.uiStore.setTimelineTabIndex(0);

    const { group, module, runningModule, teachers } = details;

    const students = details.students.map((student) => {
      const history = normalizeHistory(runningModule.duration, student.history);
      return { ...student, history };
    });

    runInAction(() => {
      this.group = group;
      this.module = module;
      this.currentModule = runningModule;
      this.students = students;
      this.teachers = teachers;
    });
  }

  @action
  clearCurrentModule = () => {
    this.currentModule = null;
  }

  addTeacher = async (moduleId, teacherId) => {
    try {
      const teachers = await fetchJSON(`/api/running/teacher/${moduleId}/${teacherId}`, 'POST');
      runInAction(() => this.teachers = teachers);
    } catch (err) {
      stores.uiStore.setLastError(err);
    }
  }

  deleteTeacher = async (moduleId, userId) => {
    try {
      const teachers = await fetchJSON(`/api/running/teacher/${moduleId}/${userId}`, 'DELETE');
      runInAction(() => this.teachers = teachers);
    } catch (err) {
      stores.uiStore.setLastError(err);
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
      stores.uiStore.setLastError(err);
    }
  }

  getReadme = async (repoName) => {

    if (this.readme != null) {
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

  async getGroupsByGroupName(groupName) {
    try {
      const runningModules = await fetchJSON(`/api/groups/currentgroups/${groupName}`);

      let computedDate = moment(runningModules[0].starting_date);
      const currentDate = moment();
      let index = 0;

      for (; index < runningModules.length; index++) {
        if (computedDate.isSameOrAfter(currentDate)) {
          break;
        }
        const { duration } = runningModules[index];
        computedDate = computedDate.add(duration, 'weeks');
      }

      index = Math.max(0, index - 1);
      const runningModule = runningModules[index];
      this.getRunningModuleDetails(runningModule.id);
      const date = computedDate.diff(currentDate, "weeks");
      const start = runningModules[index].duration - date;

      runInAction(() => {
        this.currentWeek = start;
      });
    } catch (err) {
      stores.uiStore.setLastError(err);
    }
  }

  @action
  saveAttendance = async (student, weekNum, data) => {
    const { id: runningId, duration } = this.currentModule;
    try {
      const result = await fetchJSON(`/api/history/${runningId}/${student.id}/${weekNum}`, 'POST', data);
      const history = normalizeHistory(duration, result);

      runInAction(() => {
        const updatedStudent = this.students.find(s => s.id === student.id);
        if (!updatedStudent) {
          throw new Error(`Can't find student ${student.id}.`);
        }
        updatedStudent.history = history;
      });
    } catch (err) {
      stores.uiStore.setLastError(err);
    }
  }
}
