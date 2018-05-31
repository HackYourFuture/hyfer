import {
  AVATAR_URL_CHANGED,
  ISTEACHER_STATE_CHANGED,
  ISSTUDENT_STATE_CHANGED,
  LOGIN_STATE_CHANGED,
  USER_ID,
  IS_EMAIL_EXISTED,
} from './';

const CURRENT_USER_INFO_URL = 'http://localhost:3005/api/user';

export default function() {
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

  //Normal methods

  const getUserInfo = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(CURRENT_USER_INFO_URL, {
      credentials: 'same-origin',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });
    // if the response is not Okay or any error attached to it
    // throw it to the catch and don't continue
    if (!res.ok) throw res;
    const jsonRes = await res.json();
    const isLoggedIn = true;
    const isATeacher = jsonRes.role === 'teacher' ? true : false;
    const isStudent = jsonRes.role === 'student' ? true : false;
    const isEmail = jsonRes.email ? true : false;
    _getProfileImg(jsonRes.username);
    _getProfileId(jsonRes.id);
    // notify login
    setState({
      type: LOGIN_STATE_CHANGED,
      payload: {
        isLoggedIn,
      },
    });
    //notify a teacher
    setState({
      type: ISTEACHER_STATE_CHANGED,
      payload: {
        isATeacher,
      },
    });
    setState({
      type: ISSTUDENT_STATE_CHANGED,
      payload: {
        isStudent,
      },
    });
    // notify set email
    setState({
      type: IS_EMAIL_EXISTED,
      payload: {
        isEmail,
      },
    });
  };

  // Helper methods
  const _getProfileImg = username => {
    const avatarUrl = `https://avatars.githubusercontent.com/${username}`;
    //notify avatar url changed
    setState({
      type: AVATAR_URL_CHANGED,
      payload: {
        avatarUrl,
      },
    });
  };

  const _getProfileId = id => {
    //notify set userId
    setState({
      type: USER_ID,
      payload: {
        id,
      },
    });
  };

  return {
    subscribe,
    unsubscribe,
    isSubscribed,
    getState,
    setState,
    getUserInfo,
  };
}
