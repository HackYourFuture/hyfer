import moment from 'moment';

import {
  TIMELINE_GROUPS_CHANGED,
  TIMELINE_ITEMS_CHANGED,
  MODAL_STATE_CHANGED
} from './';

const BASE_URL = 'http://localhost:3005';

export default function() {
  let _observers = [];
  let _data = {};

  const subscribe = observer => {
    _observers.push(observer);
  };

  const unsubscribe = observer => {
    _observers = _observers.filter(item => item !== observer);
  };

  const isSubscribed = observer => {
    return _observers.includes(observer);
  };

  const setState = merge => {
    let old = {};
    for (let changedItemKey in merge.payload) {
      if (_data.hasOwnProperty(changedItemKey)) {
        old[changedItemKey] = merge.payload[changedItemKey];
      }
      _data[changedItemKey] = merge.payload[changedItemKey];
    }

    _observers.forEach(observer => observer(merge, old));
  };

  const getState = () => {
    return _data;
  };

  // Normal methodes will be changing the state

  const handleToggleModal = () => {
    const currentModalState = _data.isModalOpen || false;
    setState({
      type: MODAL_STATE_CHANGED,
      payload: {
        isModalOpen: !currentModalState
      }
    });
  };

  const getTimelineItems = () => {
    fetch(`${BASE_URL}/api/timeline`)
      .then(res => res.json())
      .then(resJson => {
        const groups = _extractGroups(resJson);
        const items = _extractItems(resJson, groups);
        setState({
          type: TIMELINE_GROUPS_CHANGED,
          payload: {
            groups: groups
          }
        });

        setState({
          type: TIMELINE_ITEMS_CHANGED,
          payload: {
            items: items
          }
        });
      });
  };

  const handleAddClass = (className, startingDate) => {
    const date = new Date(startingDate);
    const body = {
      group_name: className,
      starting_date: date.toISOString()
    };
    console.log(body);

    fetch(`${BASE_URL}/api/groups`, {
      method: 'POST',
      headers: {
        'Conetent-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }).then(res => {
      console.log(res);
      handleToggleModal();
    });
  };

  // Helper methods

  const _extractGroups = data => {
    const allGroups = Object.keys(data).map(item => {
      return {
        id: item
      };
    });
    return allGroups;
  };

  const _extractItems = (data, groups) => {
    let allItems = [];
    groups.forEach(group => {
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
        git_repo: item.git_repo
      };
    });
  };

  return {
    subscribe,
    unsubscribe,
    isSubscribed,
    getState,
    setState,
    getTimelineItems,
    handleToggleModal,
    handleAddClass
  };
}
