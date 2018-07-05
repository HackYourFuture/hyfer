import { configure } from 'mobx';
import GlobalStore from './GlobalStore';
import HomeworkStore from './HomeworkStore';
import UserStore from './UserStore';
import ModulesStore from './ModulesStore';
import TimeLineStore from './TimeLineStore';

configure({ enforceActions: true });

export const API_BASE_URL = `${process.env.REACT_APP_API_BASE_URL}/api`;

export default {
  userStore: new UserStore(),
  homeworkStore: new HomeworkStore(),
  global: new GlobalStore(),
  modulesStore: new ModulesStore(),
  timeLineStore: new TimeLineStore(),
};
