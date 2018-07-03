import { action, observable, runInAction } from 'mobx';
import moment from 'moment';
import { fetchJSON } from './util';
import stores, { API_BASE_URL } from '.';

export default class TimeLineStore {

  @observable
  groups = null; // array

  @observable
  groupsWithIds = []; // array

  @observable
  allWeeks = null; // array

  @observable
  modules = null; // Array


  @observable
  allSundays = []; // array

  @observable
  items = null; // Object

  @observable
  teachers = []; // Array

  @action.bound
  async fetchItems() {
    // If data already fetched, no need to fetch it again
    if (this.groups) {
      return;
    }

    const timelineItems = await fetchJSON('/timeline');
    const groupsWithIds = await fetchJSON('/groups');

    // set the state with the array of all current groups [maybe needed for side column group names]
    const groups = Object.keys(timelineItems);
    groups.sort((group1, group2) => {
      return +group1.split(' ')[1] > +group2.split(' ')[1];
    });
    const orderedTimelineItems = {};
    groups.forEach(group => {
      orderedTimelineItems[group] = timelineItems[group];
    });

    const withEndingDate = this.setEndingDateForModules(orderedTimelineItems, groups);
    runInAction(() => {
      this.groups = groups;
      this.groupsWithIds = groupsWithIds;
      this.items = withEndingDate; // group names
      const { allWeeks, allSundays } = this.getAllTotalWeeksAndSundays(withEndingDate);
      this.allSundays = allSundays;
      this.allWeeks = allWeeks;
    });

    if (stores.global.isTeacher) {
      const modules = await fetchJSON('/modules');
      const res = await fetchJSON('/user/all');
      runInAction(() => {
        this.modules = modules;
        const teachers = res.filter(user => user.role === 'teacher');
        this.teachers = teachers;
      }); // if any error appears we will catch it by propagation
    }
  }

  @action.bound
  async addNewClass(className, starting_date) {
    const date = new Date(starting_date);
    const body = {
      group_name: className,
      starting_date: date.toISOString(),
      archived: 0,
    };
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE_URL}/groups`, {
      method: 'POST',
      headers: {
        'Content-Type': 'Application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw res;
    return res;
  }

  @action.bound
  async patchGroupsModules(
    item,
    newPosition,
    newDuration,
    teacher1_id,
    teacher2_id,
    group_id
  ) {
    // we need position for request and group_name to filter the group id wanted
    const { position } = item;
    const token = localStorage.getItem('token');
    const body = {
      duration: newDuration,
      position: newPosition,
      teacher1_id,
      teacher2_id,
    };
    try {
      const res = await fetch(
        `${API_BASE_URL}/running/update/${group_id}/${position}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'Application/json',
            Authorization: 'Bearer ' + token,
          },
          body: JSON.stringify(body),
        }
      );
      if (!res.ok) throw res;
      return await res.json();
    } catch (err) {
      stores.global.setLastError(err);
    }
  }

  @action.bound
  async addModule(moduleId, groupId, position) {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(
        `${API_BASE_URL}/running/add/${moduleId}/${groupId}/${position}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'Application/json',
            Authorization: 'Bearer ' + token,
          },
        }
      );
      if (!res.ok) throw res;
      return await res.json();
    } catch (err) {
      stores.global.setLastError(err);
    }
  }

  @action.bound
  async removeModule(chosenModule) {
    // used for a once in src\store\TimeLineStore.js
    const { id, position } = chosenModule;
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE_URL}/running/${id}/${position}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'Application/json',
        Authorization: 'Bearer ' + token,
      },
    });
    if (!res.ok) throw res;
    return await res.json();
  }

  @action.bound
  async getModulesOfGroup(groupId) {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE_URL}/running/${groupId}`, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });
    if (!res.ok) throw res;
    return await res.json();
  }

  @action
  setEndingDateForModules(allItems, groups) {
    groups.forEach(group => {
      const items = allItems[group];
      items.sort((a, b) => a.position - b.position); // make sure it is sorted

      let lastDate = ''; // will be overwritten by each module of a group to set the ending date

      items.map(item => {
        if (lastDate === '') lastDate = item.starting_date;
        item.starting_date = moment(lastDate);
        if (item.starting_date.day() !== 0) {
          item.starting_date.weekday(0);
        }

        item.ending_date = moment(lastDate).add(item.duration, 'weeks');
        lastDate = moment(item.ending_date);
        return item;
      });
    });
    return allItems;
  }

  @action
  getAllTotalWeeksAndSundays(allItems) {
    const groups = Object.keys(allItems);

    const onlyModules = groups.reduce((acc, prev) => {
      return acc.concat(...allItems[prev]);
    }, []);

    const firstDate = moment.min(onlyModules.map(module => module.starting_date));
    const lastDate = moment.max(onlyModules.map(module => module.ending_date));

    return this.getAllWeeks(firstDate, lastDate);
  }

  @action
  getAllWeeks(startingDate, endingDate) {
    const allSundays = [];
    let tempDate = startingDate.clone();
    while (tempDate.day(0).isBefore(endingDate)) {
      allSundays.push(moment(tempDate));
      tempDate = tempDate.add(1, 'weeks');
    }

    const allWeeks = allSundays.reduce((acc, prevItem, index, arr) => {
      const nextItem = arr[index + 1];
      if (!nextItem) return acc;
      const oneWeek = [prevItem, nextItem];
      acc.push(oneWeek);
      return acc;
    }, []);

    return { allWeeks, allSundays };
  }
}
