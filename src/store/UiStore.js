import { observable, runInAction } from 'mobx';

const BASE_URL = 'https://api.github.com';

export default class UiStore {
  @observable isLoggedIn = false;
  @observable isATeacher = false;
  @observable profileImgUrl = '';

  getUserInfo = () => {
    fetch('http://localhost:3005/api/user')
      .then(res => res.json())
      .then(jsonRes => {
        runInAction(() => {
          this.isLoggedIn = true;
          this.isATeacher = jsonRes.role === 'teacher' ? true : false;
          this.getProfileImg(jsonRes.username);
        });
      });
  };

  getProfileImg = username => {
    fetch(`${BASE_URL}/users/${username}`)
      .then(blob => blob.json())
      .then(jsonRes => {
        runInAction(() => {
          this.profileImgUrl = jsonRes.avatar_url;
        });
      });
  };
}
