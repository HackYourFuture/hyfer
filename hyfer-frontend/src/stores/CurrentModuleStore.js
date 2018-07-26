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
  readMe = null;

  @observable
  group = null;

  @observable
  module = null;

  @observable
  notes = '';

  @observable
  students = [];

  @observable
  teachers = [];

  @observable
  currentWeek = null;

  @observable
  selectedModule = null;

  @action
  async getRunningModuleDetails(selectedModule) {
    try {
      const details = await fetchJSON(`/api/running/details/${selectedModule.running_module_id}`);
      stores.timeline.setTabIndex(0);

      const { group, module, teachers, notes } = details;

      const students = details.students.map((student) => {
        const history = normalizeHistory(selectedModule.duration, student.history);
        return { ...student, history };
      });

      runInAction(() => {
        this.selectedModule = selectedModule;
        this.group = group;
        this.module = module;
        this.notes = notes || '';
        this.students = students;
        this.teachers = teachers;
      });
    } catch (err) {
      stores.notification.reportError(err);
    }
  }

  @action
  clearSelectedModule = () => {
    this.selectedModule = null;
  }

  @action
  addTeacher = async (moduleId, teacherId) => {
    try {
      const teachers = await fetchJSON(`/api/running/teacher/${moduleId}/${teacherId}`, 'POST');
      runInAction(() => this.teachers = teachers);
    } catch (err) {
      stores.notification.reportError(err);
    }
  }

  @action
  deleteTeacher = async (moduleId, userId) => {
    try {
      const teachers = await fetchJSON(`/api/running/teacher/${moduleId}/${userId}`, 'DELETE');
      runInAction(() => this.teachers = teachers);
    } catch (err) {
      stores.notification.reportError(err);
    }
  }

  @action
  saveNotes = async (notes) => {
    try {
      if (!this.selectedModule) {
        throw new Error('Cannot save notes: no current module set.');
      }
      const { running_module_id } = this.selectedModule;
      const updatedNotes = await fetchJSON(`/api/running/notes/${running_module_id}`, 'PATCH', { notes });
      runInAction(() => this.notes = updatedNotes);
    } catch (err) {
      stores.notification.reportError(err);
    }
  }

  @action
  getReadMe = async (repoName) => {
    if (this.readMe != null) {
      return;
    }

    try {
      const res = await fetch(`${HYF_GITHUB_URL}/${repoName}/readme`);
      if (!res.ok) throw res;
      const readmeEncoded = await res.json();
      const readmeDecoded = atob(readmeEncoded.content);
      const html = this.converter.makeHtml(readmeDecoded);
      runInAction(() => {
        this.readMe = { repoName, html };
      });
    } catch (err) {
      stores.notification.reportError(err);
    }
  }

  @action
  async getGroupsByGroupName(groupName) {
    try {
      const { modules } = stores.timeline.groupItems[groupName];

      let computedDate = moment(modules[0].starting_date);
      const currentDate = moment();
      let index = 0;

      for (; index < modules.length; index++) {
        if (computedDate.isSameOrAfter(currentDate)) {
          break;
        }
        const { duration } = modules[index];
        computedDate = computedDate.add(duration, 'weeks');
      }

      index = Math.max(0, index - 1);

      const module = modules[index];
      await this.getRunningModuleDetails(module);

      const date = computedDate.diff(currentDate, "weeks");
      const start = modules[index].duration - date;

      runInAction(() => {
        this.currentWeek = start;
      });
    } catch (err) {
      stores.notification.reportError(err);
    }
  }

  @action
  saveAttendance = async (student, weekNum, data) => {
    const { running_module_id, duration } = this.selectedModule;
    try {
      const result = await fetchJSON(`/api/history/${running_module_id}/${student.id}/${weekNum}`, 'POST', data);
      const history = normalizeHistory(duration, result);

      runInAction(() => {
        const updatedStudent = this.students.find(s => s.id === student.id);
        if (!updatedStudent) {
          throw new Error(`Can't find student ${student.id}.`);
        }
        updatedStudent.history = history;
      });
    } catch (err) {
      stores.notification.reportError(err);
    }
  }
}
