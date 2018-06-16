import { observable, runInAction, action } from 'mobx';

const CURRENT_USER_INFO_URL = 'http://localhost:3005/api/user';

export default class UserStore {
  @observable
  isLoggedIn = false;

  @observable
  isATeacher = false;

  @observable
  isStudent = false;

  @observable
  avatarUrl = '';

  @observable
  user_id = '';

  @observable
  isEmail = false;

  @action
  getUserInfo = async () => {
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
    this._getProfileImg(jsonRes.username);
    this._getProfileId(jsonRes.id);
    // notify login
    runInAction(() => {
      this.isLoggedIn = isLoggedIn;
      this.isATeacher = isATeacher;
      this.isStudent = isStudent;
      this.isEmail = isEmail;

    });
  };

  @action
  _getProfileImg = username => {
    const avatarUrl = `https://avatars.githubusercontent.com/${username}`;
    runInAction(() => {
      this.avatarUrl = avatarUrl;
    });
  };

  @action
  _getProfileId = id => {
    runInAction(() => {
      this.user_id = id;

    });

  };

  @action
  changeLogin = (login) => {
    runInAction(() => {
      this.isLoggedIn = login;
    });
  };

  @action
  setEmail = (status) => {
    this.isEmail = status;
  };


}

