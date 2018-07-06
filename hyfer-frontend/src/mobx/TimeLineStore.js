import { action, observable, computed, runInAction } from 'mobx';
import moment from 'moment';
import { fetchJSON } from './util';
import stores from '.';

function adjustDates(timelineItems) {
  return Object.keys(timelineItems)
    .reduce((acc, groupName) => {
      const groupItems = timelineItems[groupName];
      let starting_date = moment(groupItems[0].starting_date);
      if (starting_date.day() !== 0) {
        starting_date.weekday(0);
      }
      acc[groupName] = groupItems.map(item => {
        const nextStarting = moment(starting_date).add(item.duration, 'weeks');
        const adjustedItem = { ...item, starting_date, ending_date: moment(nextStarting).subtract(1, 'days') };
        starting_date = moment(nextStarting);
        return adjustedItem;
      });
      return acc;
    }, {});
}

export default class TimeLineStore {

  dataFetched = false;

  @observable
  items = null; // Object

  @observable
  groupsWithIds = []; // array

  @computed
  get groups() { return Object.keys(this.items); }

  @computed
  get allSundays() {
    if (!this.items) {
      return null;
    }
    const runningModules = Object.keys(this.items)
      .reduce((acc, item) => {
        return acc.concat(...this.items[item]);
      }, []);

    const firstDate = moment.min(runningModules.map(module => module.starting_date));
    const lastDate = moment.max(runningModules.map(module => module.ending_date));

    const allSundays = [];
    let tempDate = firstDate.clone();
    while (tempDate.day(0).isBefore(lastDate)) {
      allSundays.push(moment(tempDate));
      tempDate = tempDate.add(1, 'weeks');
    }
    return allSundays;
  }

  @computed
  get allWeeks() {
    if (!this.allSundays) {
      return null;
    }
    return this.allSundays.reduce((acc, prevItem, index, arr) => {
      const nextItem = arr[index + 1];
      if (!nextItem) return acc;
      const oneWeek = [prevItem, nextItem];
      acc.push(oneWeek);
      return acc;
    }, []);
  }

  @action.bound
  async fetchItems() {
    if (this.dataFetched) {
      return;
    }

    const timelineItems = await fetchJSON('/timeline');
    const groupsWithIds = await fetchJSON('/groups');

    runInAction(() => {
      this.groupsWithIds = groupsWithIds;
      this.items = adjustDates(timelineItems);
      this.dataFetched = true;
    });
  }

  @action.bound
  async addNewClass(className, starting_date) {
    this.dataFetched = false;
    const date = new Date(starting_date);
    const body = {
      group_name: className,
      starting_date: date.toISOString(),
      archived: 0,
    };
    try {
      await fetchJSON('/groups', 'POST', body);
    } catch (err) {
      stores.global.setLastError(err);
    }
  }

  @action.bound
  async patchGroupsModules(item, newPosition, newDuration, teacher1_id, teacher2_id, group_id) {
    this.dataFetched = false;
    // we need position for request and group_name to filter the group id wanted
    const body = {
      duration: newDuration,
      position: newPosition,
      teacher1_id,
      teacher2_id,
    };
    try {
      await fetchJSON(`/running/update/${group_id}/${item.position}`, 'PATCH', body);
    } catch (err) {
      stores.global.setLastError(err);
    }
  }

  @action.bound
  async addModule(moduleId, groupId, position) {
    this.dataFetched = false;
    try {
      await fetchJSON(`/running/add/${moduleId}/${groupId}/${position}`, 'PATCH');
    } catch (error) {
      stores.global.setLastError(error);
    }
  }

  @action.bound
  async removeModule(chosenModule) {
    this.dataFetched = false;
    const { id, position } = chosenModule;
    try {
      await fetchJSON(`/running/${id}/${position}`, 'DELETE');
    } catch (error) {
      stores.global.setLastError(error);
    }
  }

  @action.bound
  async getModulesOfGroup(groupId) {
    const token = localStorage.getItem('token');
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/running/${groupId}`, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });
    if (!res.ok) throw res;
    return await res.json();
  }
}
