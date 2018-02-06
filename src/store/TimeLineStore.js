import { observable, action, useStrict, runInAction } from 'mobx';
import moment from 'moment';

useStrict(true);
const BASE_URL = 'http://localhost:3005';

export default class TimelineStore {
  @observable items = [];
  @observable groups = [];
  @observable isModalOpen = false;

  @action
  handleToggleModal = () => {
    this.isModalOpen = !this.isModalOpen;
  };

  // FIXME: NOT WORKING MAYBE API CONFIG THING
  @action
  handleAddClass = (className, startingDate) => {
    const body = {
      group_name: className,
      starting: startingDate
    };

    fetch(`${BASE_URL}/api/groups`, {
      method: 'POST',
      headers: {
        'Conetent-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }).then(res => console.log(res));
  };

  @action
  getItems = () => {
    fetch(`${BASE_URL}/api/timeline`)
      .then(res => res.json())
      .then(resJson => {
        runInAction(() => {
          this.groups = this.extractGroups(resJson);
          this.items = this.extractItems(resJson);
        });
      });
  };

  extractGroups(data) {
    const allGroups = Object.keys(data).map(item => {
      return {
        id: item
      };
    });
    return allGroups;
  }

  extractItems(data) {
    let allItems = [];
    this.groups.forEach(group => {
      const items = data[group.id];
      items.sort((a, b) => a.position - b.position); // make sure it is sorted

      let lastDate = ''; // will be overwritten by each module in a row

      items.map(item => {
        if (lastDate === '') lastDate = item.starting_date;
        item.starting_date = lastDate;

        item.ending_date = moment(lastDate).add(item.duration, 'weeks');
        lastDate = moment(item.ending_date);
        return item;
      });
      allItems = [...items, ...allItems];
    });
    return allItems.map(item => {
      return {
        start: moment(item.starting_date).format('YYYY-MM-DD'),
        end: moment(item.ending_date).format('YYYY-MM-DD'),
        content: item.module_name,
        group: item.group_name,
        className: item.module_name.split(' ').join('_'),
        git_repo: item.git_repo // data attributes don't accept capital letters
      };
    });
  }
}
