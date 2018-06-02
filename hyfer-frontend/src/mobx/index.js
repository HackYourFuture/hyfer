import { configure } from 'mobx';
import UserStore from './UserStore';
import HomeworkStore from './HomeworkStore';

configure({ enforceActions: true });

export default {
  userStore: new UserStore(),
  homeworkStore: new HomeworkStore(),
};
