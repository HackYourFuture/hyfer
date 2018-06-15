// import { configure } from 'mobx';
import UserStore from './UserStore';
import HomeworkStore from './HomeworkStore';
import UiStore from './UiStore';
// configure({ enforceActions: true });

export default {
  userStore: new UserStore(),
  homeworkStore: new HomeworkStore(),
  UiStore : new UiStore()
};
