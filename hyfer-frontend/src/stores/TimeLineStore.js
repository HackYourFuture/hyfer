import { observable, action, computed, runInAction } from 'mobx';
import moment from 'moment';
import EventEmitter from 'events';
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

  ee = new EventEmitter();

  itemWidth = 150;

  rowHeight = 48;

  @observable
  tabIndex = 0;

  @observable
  groupItems = null;

  @observable
  filter = 'active';

  @observable
  groups = null;

  @observable
  allSundays = null;

  @observable
  allWeeks = null;

  @computed
  get activeGroups() {
    return this.groups.filter(group => group.archived === 0);
  }

  @computed
  get selectedGroups() {
    return this.filter === 'active'
      ? this.activeGroups
      : this.groups.filter(group => group.group_name === this.filter);
  }

  @action
  setFilter = (filter) => {
    if (filter !== 'add') {
      this.filter = filter;
    }
  }

  @action
  setTabIndex = (value) => this.tabIndex = value;

  @action fetchGroups = async () => {
    const groups = await fetchJSON('/api/groups');
    runInAction(() => {
      this.groups = groups;
    });
  }

  queryParam = () => this.filter === 'active' ? '' : `?group=${this.filter}`;

  @action
  fetchTimeline = async () => {
    try {
      await this.fetchGroups();

      const timeline = await fetchJSON(`/api/running/timeline${this.queryParam()}`);
      runInAction(() => {
        this.setTimelineItems(timeline);
      });
    } catch (err) {
      stores.notification.reportError(err);
    }
  }

  @action
  setTimelineItems(timeline) {
    const filteredTimeline = Object.keys(timeline)
      .reduce((acc, key) => {
        if (this.filter === 'active' || this.filter === key) {
          acc[key] = timeline[key];
        }
        return acc;
      }, {});

    const groupItems = addModuleDates(filteredTimeline);

    const allModules = Object.keys(groupItems)
      .reduce((acc, groupName) => {
        return acc.concat(...groupItems[groupName].modules);
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
      if (nextItem) {
        const oneWeek = [prevItem, nextItem];
        acc.push(oneWeek);
      }
      return acc;
    }, []);

    runInAction(() => {
      this.groupItems = groupItems;
      this.allSundays = allSundays;
      this.allWeeks = allWeeks;
    });
  }

  @action
  updateModule = async (item, groupId, duration, position = null) => {
    try {
      const data = { duration };
      if (position != null) {
        data.position = position;
      }
      const timeline = await fetchJSON(`/api/running/update/${groupId}/${item.position}${this.queryParam()}`,
        'PATCH', data);
      this.setTimelineItems(timeline);
    } catch (err) {
      stores.notification.reportError(err);
    }
  }

  addModule = async (moduleId, groupId, position) => {
    try {
      const timeline = await fetchJSON(`/api/running/add/${moduleId}/${groupId}/${position}${this.queryParam()}`, 'PATCH');
      this.setTimelineItems(timeline);
    } catch (error) {
      stores.notification.reportError(error);
    }
  }

  @action
  removeModule = async (groupId, position) => {
    try {
      const timeline = await fetchJSON(`/api/running/${groupId}/${position}${this.queryParam()}`, 'DELETE');
      this.setTimelineItems(timeline);
    } catch (error) {
      stores.notification.reportError(error);
    }
  }

  @action
  splitModule = async (groupId, position) => {
    try {
      const timeline = await fetchJSON(`/api/running/split/${groupId}/${position}${this.queryParam()}`, 'PATCH');
      this.setTimelineItems(timeline);
    } catch (error) {
      stores.notification.reportError(error);
    }
  }

  @action
  addNewClass = async (className, startingDate) => {
    const body = {
      group_name: className,
      starting_date: startingDate,
      archived: 0,
    };
    try {
      await fetchJSON('/api/groups', 'POST', body);
    } catch (err) {
      stores.notification.reportError(err);
    }
  }

  @action
  updateClass = async (groupId, updates) => {
    try {
      await fetchJSON(`/api/groups/${groupId}`, 'PATCH', updates);
    } catch (error) {
      stores.notification.reportError(error);
    }
  }

  notify(message, value) {
    this.ee.emit(message, value);
  }

  onNotify(value, cb) {
    this.ee.on(value, cb);
  }
}
