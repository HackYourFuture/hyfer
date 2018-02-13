import marked from 'marked';

import { REPO_NAME_CHANGED, READ_ME_CHANGED } from './index';

const BASE_URL = 'https://api.github.com/repos/HackYourFuture';

export default function ModuleInfoStore() {
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
  //TODO: change name cause it's getting the repo name as well
  const getRepoName = clickEvent => {
    let repoName = null;
    const target = clickEvent.event.target;
    const gitRepoDataField = target.parentNode.parentNode.dataset.git_repo;
    const noRepoAlternative = 'NOREPO'; // alternative name for if a module doesn't have a repo
    if (target.className !== 'vis-item-content') return; // if the selected element is not the wanted one

    // if the selected element doesn't have a repo
    if (!gitRepoDataField) {
      repoName = noRepoAlternative;
      return;
    }
    repoName = gitRepoDataField;

    const mergedData = {
      type: REPO_NAME_CHANGED,
      payload: repoName
    };

    setState(mergedData);
  };

  const getReadme = () => {
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
      });
  };

  return {
    subscribe,
    unsubscribe,
    isSubscribed,
    getState,
    setState,
    getReadme,
    getRepoName
  };
}
