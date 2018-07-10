import { observable, computed, runInAction } from 'mobx';
import moment from 'moment';
import { fetchJSON } from './util';
import stores from '.';

function addModuleDates(timelineItems) {
  const groupNames = Object.keys(timelineItems);
  return groupNames.reduce((acc, groupName) => {
    const groupInfo = timelineItems[groupName];
    let starting_date = moment.utc(groupInfo.starting_date);
    const modules = groupInfo.modules.map((module) => {
      if (starting_date.day() !== 0) {
        starting_date.weekday(0);
      }
      const nextStarting = moment(starting_date).add(module.duration, 'weeks');
      const newModule = {
        ...module,
        starting_date,
        ending_date: moment(nextStarting).subtract(1, 'days'),
      };
      starting_date = moment(nextStarting);
      return newModule;
    });
    groupInfo.modules = modules;
    acc[groupName] = {
      group_id: groupInfo.group_id,
      starting_date: groupInfo.starting_date,
      modules,
    };
    return acc;
  }, {});
}

export default class TimeLineStore {

  dataFetched = false;

  @observable
  items = null;

  @observable
  groupsWithIds = [];

  @computed
  get groups() { return Object.keys(this.items); }

  @observable
  allSundays = null;

  @observable
  allWeeks = null;

  fetchItems = async () => {
    if (this.dataFetched) {
      return;
    }

    const timelineItems = await fetchJSON('/api/timeline');
    const groupsWithIds = await fetchJSON('/api/groups');
    this.dataFetched = true;

    const items = addModuleDates(timelineItems);

    const allModules = Object.keys(items)
      .reduce((acc, groupName) => {
        return acc.concat(...items[groupName].modules);
      }, []);

    const firstDate = moment.min(allModules.map(module => module.starting_date));
    const lastDate = moment.max(allModules.map(module => module.ending_date));

    const allSundays = [];
    let tempDate = firstDate.clone();
    while (tempDate.day(0).isBefore(lastDate)) {
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

    runInAction(() => {
      this.items = items;
      this.groupsWithIds = groupsWithIds;
      this.allSundays = allSundays;
      this.allWeeks = allWeeks;
    });
  }

  addNewClass = async (className, starting_date) => {
    this.dataFetched = false;
    const date = new Date(starting_date);
    const body = {
      group_name: className,
      starting_date: date.toISOString(),
      archived: 0,
    };
    try {
      await fetchJSON('/api/groups', 'POST', body);
    } catch (err) {
      stores.global.setLastError(err);
    }
  }

  patchGroupsModules = async (item, newPosition, newDuration) => {
    this.dataFetched = false;
    // we need position for request and group_name to filter the group id wanted
    const body = {
      duration: newDuration,
      position: newPosition,
    };
    try {
      await fetchJSON(`/api/running/update/${item.group_id}/${item.position}`, 'PATCH', body);
    } catch (err) {
      stores.global.setLastError(err);
    }
  }

  addModule = async (moduleId, groupId, position) => {
    this.dataFetched = false;
    try {
      await fetchJSON(`/api/running/add/${moduleId}/${groupId}/${position}`, 'PATCH');
    } catch (error) {
      stores.global.setLastError(error);
    }
  }

  removeModule = async (chosenModule) => {
    this.dataFetched = false;
    const { id, position } = chosenModule;
    try {
      await fetchJSON(`/api/running/${id}/${position}`, 'DELETE');
    } catch (error) {
      stores.global.setLastError(error);
    }
  }
}
