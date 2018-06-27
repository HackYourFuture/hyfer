import {
  TIMELINE_GROUPS_CHANGED,
  TIMELINE_ITEMS_CHANGED,
  ALL_WEEKS_CHANGED,
  ALL_POSSIBLE_MODULES_CHANGED,
  ALL_SUNDAYS_CHANGED,
  ALL_TEACHERS_CHANGED,
  INFO_SELECTED_MODULE_CHANGED,
  GROUPS_WITH_IDS_CHANGED,
} from './';

import {
  getAllTotalWeeksAndSundays,
  getTimelineItems,
  setEndingDateForModules,
  weekLonger,
  weekShorter,
  moveLeft,
  moveRight,
  assignTeachers,
  addNewClass,
  getALlPossibleModules,
  addNewModuleToClass,
  removeModule,
  getAllSharedDates,
  getTeachers,
  getModulesOfGroup,
  getAllGroupsWithIds,
} from '../util';

import userStore from './UserStore';

import { errorMessage } from '../notify';

const BASE_URL = 'http://localhost:3005';

export default function () {
  let _observers = [];
  const _data = {};

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
    const old = {};
    for (const changedItemKey in merge.payload) {
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

  const fetchItems = async isTeacher => {
    const timelineItems = await getTimelineItems(BASE_URL + '/api/timeline'); // if any error appears we will catch it by propagation

    // set the state with the array of all current groups [maybe needed for side column group names]
    const groups = Object.keys(timelineItems);
    groups.sort((group1, group2) => {
      return +group1.split(' ')[1] > +group2.split(' ')[1];
    });
    const orderedTimelineItems = {};
    groups.forEach(group => {
      orderedTimelineItems[group] = timelineItems[group];
    });

    const groupsWithIds = await getAllGroupsWithIds(); // the error has been thrown

    setState({
      type: GROUPS_WITH_IDS_CHANGED,
      payload: {
        groupsWithIds,
      },
    });

    const withEndingDate = setEndingDateForModules(
      orderedTimelineItems,
      groups
    ); // group names
    // set the state with the new received items
    setState({
      type: TIMELINE_ITEMS_CHANGED,
      payload: {
        items: withEndingDate,
      },
    });

    if (userStore.state.currentUser.role === 'teacher') {

      // get all possible modules for addition
      const allPossibleModules = await getALlPossibleModules().catch(e => {
        // specific error catch it here.
        // we don't need any return on all of the users
        // On 403 Forbidden
        if (e.status === 403) return;
        // if the user has any other problems?!
        errorMessage(e);
      });
      setState({
        type: ALL_POSSIBLE_MODULES_CHANGED,
        payload: {
          modules: allPossibleModules,
        },
      });
    }

    // get all sundays and count how many weeks
    const { allWeeks, allSundays } = getAllTotalWeeksAndSundays(withEndingDate);

    //set State with all sundays
    setState({
      type: ALL_SUNDAYS_CHANGED,
      payload: {
        allSundays,
      },
    });

    // Set state with all weeks moments
    setState({
      type: ALL_WEEKS_CHANGED,
      payload: {
        allWeeks,
      },
    });

    if (isTeacher) {
      getTeachers().then(res => {
        const teachers = res.filter(user => user.role === 'teacher');
        setState({
          type: ALL_TEACHERS_CHANGED,
          payload: {
            teachers,
          },
        });
      }); // if any error appears we will catch it by propagation
    }

    setState({
      type: TIMELINE_GROUPS_CHANGED,
      payload: {
        // TODO:
        groups,
      },
    });

    // set state with total weeks during all known schedule for current classes
  };

  const updateModule = (module, action) => {
    let result = null;
    switch (action) {
      case 'weekLonger':
        result = weekLonger(module);
        break;
      case 'removeModule':
        result = removeModule(module);
        break;
      case 'weekShorter':
        result = weekShorter(module, getState().groups);
        break;
      case 'moveLeft':
        result = moveLeft(module, getState().groups);
        break;
      case 'moveRight':
        result = moveRight(module, getState().groups);
        break;
      default:
        break;
    }

    result
      .then(() => {
        return fetchItems();
      }) // catching it here so we don't need to catch it any more especially it's switch cases
      .catch(errorMessage);
  };

  const handleAssignTeachers = (item, teacher1, teacher2) => {
    // used for a once in src\components\timelineComp\ClassTaskRowComp\DropdownList\AssignTeacherModal\AssignTeacherModal.js
    return (
      // item.id is the id of the group
      assignTeachers(item, item.id, teacher1, teacher2)
        // when done go back through the whole procedure to get the items on screen
        .then(() => {
          fetchItems();
        })
    );
  };

  const handleAddModule = (
    selectedModuleId,
    selectedGroup,
    duration,
    selectedDate,
    items
  ) => {
    const { modules } = _data; // getting all modules from the store directly
    // make all the computations in util
    return addNewModuleToClass(
      selectedModuleId,
      selectedGroup,
      duration,
      selectedDate,
      items,
      modules
    ).then(() => {
      // catching the error By propagation in  src/components/timelineComp/Buttons/AddDropdownList/AddNewModuleModal/AddNewModuleModal.js
      fetchItems();
    });
  };

  const addTheClass = (className, starting_date) => {
    // used for a once in src\components\timelineComp\Buttons\AddDropdownList\AddClassModal\AddClassModal.js
    return addNewClass(className, starting_date).then(() => fetchItems());
  };

  const getSharedDates = items => {
    return getAllSharedDates(items);
  };

  const getSelectedModuleInfo = item => {
    // give it to util to handle
    // nothing is returning from it as a promise we can handle it here
    getModulesOfGroup(item.id)
      .then(res => {
        setState({
          type: INFO_SELECTED_MODULE_CHANGED,
          payload: {
            allModulesOfGroup: res[item.position],
          },
        });
      })
      .catch(errorMessage);
  };

  return {
    subscribe,
    unsubscribe,
    isSubscribed,
    getState,
    setState,
    fetchItems,
    updateModule,
    handleAddModule,
    addTheClass,
    getSharedDates,
    handleAssignTeachers,
    getSelectedModuleInfo,
  };
}
