import marked from 'marked';
import moment from 'moment';

import { REPO_NAME_CHANGED, READ_ME_CHANGED, HISTORY_CHANGED } from './';

const BASE_URL = 'https://api.github.com/repos/HackYourFuture';
const noRepoAlternative = 'NOREPO'; // alternative name for if a module doesn't have a repo

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

  const getHistory = clickEvent => {

     _getRepoNameAndSundays(clickEvent);
    getReadme();

    const { group_id, running_module_id, group, duration, repoName, start, end } = _data;
    let modeuleSundays = _getSundays(start, end)
    let sundays = {sundays: modeuleSundays}
    let BASE_URL = 'http://localhost:3005/api/history';
    //sundays format should look like this => {sundays: ["2016/11/06", "2016/11/13", "2016/11/20"]};
    fetch(`${BASE_URL}/${running_module_id}/${group_id}`, {
      method: 'PATCH', 
      body: JSON.stringify(sundays),
      headers: {
      'Content-Type': 'application/json',
      }, 
    })
    .then(response => response.json())
    .then(response => {
      const keys = Object.keys(response)

      setState({
        type: HISTORY_CHANGED,
        payload: {
          history: response,
          keys: keys,
          duration: duration,
          group_id: group_id,
          running_module_id: running_module_id,
          repoName: repoName,
          group_name: group
        }
      });
    })
    .catch(err => console.log(err))
  }
  
  const getReadme = () => {
    // check if there is a valid repoName
    if (!_data.repoName || _data.repoName === noRepoAlternative) return;
    // make the request
    fetch(`${BASE_URL}/${_data.repoName}/readme`)
      .then(res => res.json())
      .then(readmeEncoded => {
        const readmeDecoded = atob(readmeEncoded.content);
        const readmeHtml = marked(readmeDecoded);

        setState({
          type: READ_ME_CHANGED,
          payload: {
            readme: readmeHtml
          }
        });
      })
      .catch(err => console.log(err));
  };

  // Helper methods used to help the state changing methods above

  const _getRepoNameAndSundays = clickEvent => {
    // it is a promise because it is being used in the getReadme function and that one won't wait
    let repoName = null;
    const target = clickEvent.event.target;
    const dataset = clickEvent.event.target.parentNode.parentNode.dataset;
    const { start, end, git_repo, group_id, group, running_module_id, duration } = dataset;
    if (target.className !== 'vis-item-content') return; // if the selected element is not the wanted one

    // if the selected element doesn't have a repo
    if (!git_repo) {
      repoName = noRepoAlternative;
      setState({});
    } else {
      repoName = git_repo;
    }

    const mergedData = {
      type: REPO_NAME_CHANGED,
      payload: {
        repoName,
        group_id,
        running_module_id,
        duration,
        start,
        end,
        group,
      }
    };
    setState(mergedData);
  };

  const _getSundays = (startString, endString) => {
    // note: not passing just a string because moment is throwing a warning about the format of the string
    const start = moment(new Date(startString));
    const end = moment(new Date(endString));

    const allSundays = [];
    while (start.day(0).isBefore(end)) {
      allSundays.push(start.clone().format('YYYY/MM/DD'));
      start.add(1, 'weeks');
    }
    return allSundays;
    
  };

  return {
    subscribe,
    unsubscribe,
    isSubscribed,
    getState,
    setState,
    getReadme,
    getHistory
  };
}
