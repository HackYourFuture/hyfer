import moment from 'moment';

const BASE_URL = 'http://localhost:3005';

//return a promise with `then` getting the json formatted data
export function getTimelineItems() {
  return fetch(BASE_URL + '/api/timeline').then(res => res.json());
}

export function setEndingDateForModules(allItems, groups) {
  groups.forEach(group => {
    const items = allItems[group];
    items.sort((a, b) => a.position - b.position); // make sure it is sorted

    let lastDate = ''; // will be overwritten by each module of a group to set the ending date

    items.map(item => {
      if (lastDate === '') lastDate = item.starting_date;
      item.starting_date = moment(lastDate);

      item.ending_date = moment(lastDate).add(item.duration, 'weeks');
      lastDate = moment(item.ending_date);
      return item;
    });
  });
  return allItems;
}

export function getAllGroupsWithIds() {
  return fetch(`${BASE_URL}/api/groups`).then(res => res.json());
}

export function getAllTotalWeeksAndSundays(allItems) {
  const groups = Object.keys(allItems);

  const onlyModules = groups.reduce((acc, prev) => {
    return acc.concat(...allItems[prev]);
  }, []);

  const firstDate = moment.min(onlyModules.map(module => module.starting_date));
  const lastDate = moment.max(onlyModules.map(module => module.ending_date));

  return _getAllWeeks(firstDate, lastDate);
}

export function getTeachers() {
  return fetch(`${BASE_URL}/api/users`).then(res => res.json());
}

export function getWeeksBeforeAndAfter(allWeeks, classModules) {
  // starting date of the first module of a class
  const firstModuleStartingDate = moment.min(
    classModules.map(week => week.starting_date)
  );

  // the ending date of the last module of a class
  const lastModuleEndingDate = moment.max(
    classModules.map(week => week.ending_date)
  );

  // get an array with all the weeks before the start of this class
  const weeksBefore = allWeeks.filter(week =>
    week[0].isBefore(firstModuleStartingDate)
  );

  // get an array with all the weeks agter the course has ended
  const weeksAfter = allWeeks.filter(week =>
    week[1].isAfter(lastModuleEndingDate)
  );

  return {
    weeksBefore,
    weeksAfter
  };
}

export function getCurrentWeek(week, width) {
  const today = new moment();
  if (!today.isAfter(week[0]) || !today.isBefore(week[1])) return null;
  const dayDiff = today.diff(week[0], 'days');
  const oneDayWidth = width / 7;
  const offset = oneDayWidth * dayDiff;
  return offset;
}

export function weekLonger(chosenModule, groups) {
  const { duration } = chosenModule;
  const newDuration = duration + 1;
  const groupId = chosenModule.id;
  return _patchGroupsModules(
    chosenModule,
    null,
    newDuration,
    null,
    null,
    groupId
  );
}

export function weekShorter(chosenModule, groups) {
  const { duration } = chosenModule;
  const newDuration = duration - 1;
  const groupId = chosenModule.id;

  return _patchGroupsModules(
    chosenModule,
    null,
    newDuration,
    null,
    null,
    groupId
  );
}

export function moveRight(chosenModule, groups) {
  const { position, duration } = chosenModule;
  const newPosition = position + 1;
  const groupId = chosenModule.id;

  return _patchGroupsModules(
    chosenModule,
    newPosition,
    duration,
    null,
    null,
    groupId
  );
}

export function moveLeft(chosenModule, groups) {
  const { position, duration } = chosenModule;
  const newPosition = position - 1;
  const groupId = chosenModule.id;

  return _patchGroupsModules(
    chosenModule,
    newPosition,
    duration,
    null,
    null,
    groupId
  );
}

export function removeModule(chosenModule) {
  const { id, position } = chosenModule;
  return fetch(`${BASE_URL}/api/running/${id}/${position}`, {
    method: 'DELETE'
  }).then(res => res.json());
}

export function getModulesOfGroup(groupId) {
  return fetch(`${BASE_URL}/api/running/${groupId}`).then(res => res.json());
}

////////////////////////////////////////////////////////////////// helper functions

function _patchGroupsModules(
  item,
  newPosition,
  newDuration,
  teacher1_id,
  teacher2_id,
  group_id
) {
  // we need position for request and group_name to filter the group id wanted
  const { position } = item;

  const body = {
    duration: newDuration,
    position: newPosition,
    teacher1_id,
    teacher2_id
  };
  return fetch(`${BASE_URL}/api/running/update/${group_id}/${position}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'Application/json' },
    body: JSON.stringify(body)
  }).then(res => res.json());
  // return Promise.resolve('yo I just did it');
}

function _getAllWeeks(startingDate, endingDate) {
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

// this is not used yet cause there's nothing shown to user to invoke it
export function assignTeachers(item, groupsId, teacher1_id, teacher2_id) {
  return _patchGroupsModules(
    item,
    null,
    item.duration,
    teacher1_id,
    teacher2_id,
    groupsId
  );
}

export function addNewClass(className, starting_date) {
  const date = new Date(starting_date);
  const body = {
    group_name: className,
    starting_date: date.toISOString()
  };

  return fetch(`${BASE_URL}/api/groups`, {
    method: 'POST',
    headers: {
      'Content-Type': 'Application/json'
    },
    body: JSON.stringify(body)
  });
}

export function getALlPossibleModules() {
  const token = localStorage.getItem("token")
  return fetch(`${BASE_URL}/api/modules`,
  {
    credentials: "same-origin",
    headers: {
    'Authorization':'Bearer ' + token,
  }})
  .then(res => res.json());
}

export function getAllSharedDates(items) {
  const keys = Object.keys(items);
  const minAndMax = keys.reduce(
    (acc, key) => {
      const modules = items[key];
      const startingsOfModule = modules.map(module => module.starting_date);
      let minCurrentModules = moment.min(startingsOfModule);
      if (minCurrentModules.day() !== 0) {
        const daysToSunday = 7 - minCurrentModules.day();
        for (let x = 0; x < daysToSunday; x++) {
          minCurrentModules.add(1, 'day');
        }
      }
      const endingsOfModule = modules.map(module => module.ending_date);
      const maxCurrentModules = moment.max(endingsOfModule);
      if (acc.min && acc.max) {
        const min =
          minCurrentModules.diff(acc.min) > 0 ? minCurrentModules : acc.min;
        const max =
          maxCurrentModules.diff(acc.max) < 0 ? maxCurrentModules : acc.max;
        return {
          min,
          max
        };
      } else {
        return {
          min: minCurrentModules,
          max: maxCurrentModules
        };
      }
    },
    { min: '', max: '' }
  );
  return minAndMax;
}

export function addNewModuleToClass(
  selectedModuleId,
  selectedGroup,
  duration,
  selectedDate,
  items,
  modules
) {
  if (selectedGroup !== 'All classes') {
    return _patchNewModuleForOneGroup(
      selectedModuleId,
      selectedDate,
      duration,
      selectedGroup.id,
      items,
      modules
    );
  } else {
    const allGroups = Object.keys(items);
    let allPromises = [];
    allGroups.forEach(group => {
      const groupsItems = items[group];
      const groupId = groupsItems[0].id;
      allPromises.push(
        _patchNewModuleForOneGroup(
          selectedModuleId,
          selectedDate,
          duration,
          groupId,
          groupsItems,
          modules
        )
      );
    });
    return Promise.all(allPromises).then('Fulfilled');
  }
}

function _patchNewModuleForOneGroup(
  selectedModuleId,
  selectedDate,
  duration,
  selectedGroupId,
  items,
  modules
) {
  const selectedDateMoment = new moment(selectedDate, 'YYYY-MM-DD');
  for (let item of items) {
    // case 1 it is betweeen the staritng and the end! Nasty!!/////////////////////////////////////////////
    if (selectedDateMoment.isBetween(item.starting_date, item.ending_date)) {
      // step 1 make that module shorter so that the new module could come right after
      const newDuration = _getNewDurationWhenAddingModule(
        selectedDateMoment,
        item
      );
      // send to backend the new duration to the backendc
      return _patchGroupsModules(
        item,
        item.position,
        newDuration,
        null,
        null,
        selectedGroupId
      )
        .then(res => {
          //step 2 add the new module after that one
          const position = +item.position + 1;
          // 1- add it
          return _addModule(selectedModuleId, selectedGroupId, position)
            .then(res =>
              // 2- change the duration
              _patchGroupsModules(
                { position },
                null,
                duration,
                null,
                null,
                selectedGroupId
              )
            )
            .then(res => {
              // step 3 add the new module
              const remainingDuration = item.duration - newDuration;
              const otherHalfPosition = position + 1;
              const splittedModuleId = modules.filter(
                one => one.module_name === item.module_name
              )[0].id;
              return (
                _addModule(splittedModuleId, selectedGroupId, otherHalfPosition)
                  // now adjust the duration so that it's just the rest of the module not a new one
                  .then(res => {
                    return _patchGroupsModules(
                      { position: otherHalfPosition }, //instead of whole item just the part with position
                      null,
                      remainingDuration,
                      null,
                      null,
                      selectedGroupId
                    );
                  })
              );
            })
            .catch(err => {
              console.log(err);
              return Promise.reject(); // maybe to give the user indication that it went wrong
            });
        })
        .catch(err => {
          console.log(err);
          return Promise.reject(); // maybe to give the user indication that it went wrong
        });
    }
    if (selectedDateMoment.diff(item.ending_date, 'weeks') === 0) {
      // case 2 the new module is at the end of an existing one (GREAT!)//////////////////////////////////////////////////
      const position = +item.position + 1;
      return _addModule(selectedModuleId, selectedGroupId, position).then(res =>
        _patchGroupsModules(
          { position },
          null,
          duration,
          null,
          null,
          selectedGroupId
        )
      );
    }
  }
}

async function _addModule(moduleId, groupId, position) {
  return fetch(
    `${BASE_URL}/api/running/add/${moduleId}/${groupId}/${position}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'Application/json' }
    }
  ).then(res => res.json());
}

function _getNewDurationWhenAddingModule(selectedDate, module) {
  return selectedDate.diff(module.starting_date, 'week');
}
