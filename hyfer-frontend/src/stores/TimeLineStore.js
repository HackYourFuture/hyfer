import { observable, action, computed, runInAction } from 'mobx';
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

  @observable
  timeline = null;

  @observable
  items = null;

  @observable
  filter = 'all';

  @observable
  groupsWithIds = [];

  @computed
  get groups() { return Object.keys(this.items); }

  @observable
  allSundays = null;

  @observable
  allWeeks = null;

  @action
  setFilter = (filter) => {
    this.filter = filter;
    if (this.timeline) {
      this.setTimelineItems(this.timeline);
    }
  }

  @action
  fetchItems = async () => {
    const timeline = await fetchJSON('/api/running/timeline');
    const groupsWithIds = await fetchJSON('/api/groups');
    runInAction(() => {
      this.groupsWithIds = groupsWithIds;
      this.setTimelineItems(timeline);
    });
  }

  @action
  setTimelineItems(timeline) {
    this.timeline = timeline;
    const filteredTimeline = Object.keys(this.timeline)
      .reduce((acc, key) => {
        if (this.filter === 'all' || this.filter === key) {
          acc[key] = this.timeline[key];
        }
        return acc;
      }, {});

    const items = addModuleDates(filteredTimeline);

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
      this.allSundays = allSundays;
      this.allWeeks = allWeeks;
    });
  }

  @action
  addNewClass = async (className, starting_date) => {
    const date = new Date(starting_date);
    const body = {
      group_name: className,
      starting_date: date.toISOString(),
      archived: 0,
    };
    try {
      await fetchJSON('/api/groups', 'POST', body);
    } catch (err) {
      stores.uiStore.setLastError(err);
    }
  }

  @action
  updateModule = async (item, position, duration) => {
    try {
      const timeline = await fetchJSON(`/api/running/update/${item.group_id}/${item.position}`,
        'PATCH', { position, duration });
      this.setTimelineItems(timeline);
    } catch (err) {
      stores.uiStore.setLastError(err);
    }
  }

  addModule = async (moduleId, groupId, position) => {
    try {
      const timeline = await fetchJSON(`/api/running/add/${moduleId}/${groupId}/${position}`, 'PATCH');
      this.setTimelineItems(timeline);
    } catch (error) {
      stores.uiStore.setLastError(error);
    }
  }

  @action
  removeModule = async (groupId, position) => {
    try {
      const timeline = await fetchJSON(`/api/running/${groupId}/${position}`, 'DELETE');
      this.setTimelineItems(timeline);
    } catch (error) {
      stores.uiStore.setLastError(error);
    }
  }

  @action
  splitModule = async (groupId, position) => {
    try {
      const timeline = await fetchJSON(`/api/running/split/${groupId}/${position}`, 'PATCH');
      this.setTimelineItems(timeline);
    } catch (error) {
      stores.uiStore.setLastError(error);
    }
  }
}
