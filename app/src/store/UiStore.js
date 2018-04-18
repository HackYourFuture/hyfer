import {
  AVATAR_URL_CHANGED,
  ISTEACHER_STATE_CHANGED,
  LOGIN_STATE_CHANGED
} from './';

const CURRENT_USER_INFO_URL = 'http://localhost:3005/api/user';

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

  //Normal methods

  const getUserInfo = () => {
    const token = localStorage.getItem("token")
    fetch(CURRENT_USER_INFO_URL , {
      credentials: "same-origin",
      headers: {
      'Authorization':'Bearer ' + token,
    }})
      .then(res => res.json())
      .then(jsonRes => {
        const isLoggedIn = true;
        const isATeacher = jsonRes.role === 'teacher' ? true : false;
        _getProfileImg(jsonRes.username);

        // notify login
        setState({
          type: LOGIN_STATE_CHANGED,
          payload: {
            isLoggedIn
          }
        });

        //notify a teacher
        setState({
          type: ISTEACHER_STATE_CHANGED,
          payload: {
            isATeacher
          }
        });
      })
      .catch(err => console.log(err));
  };

  // Helper methods
  const _getProfileImg = username => {
    const avatarUrl = `https://avatars.githubusercontent.com/${username}`;
    //notify avatar url changed
    setState({
      type: AVATAR_URL_CHANGED,
      payload: {
        avatarUrl
      }
    });
  };

  return {
    subscribe,
    unsubscribe,
    isSubscribed,
    getState,
    setState,
    getUserInfo
  };
}
