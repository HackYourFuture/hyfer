import { configure } from 'mobx';

import CurrentModuleStore from './CurrentModuleStore';
import CurrentUserStore from './CurrentUserStore';
import HomeworkStore from './HomeworkStore';
import ModuleStore from './ModuleStore';
import TimeLineStore from './TimeLineStore';
import UIStore from './UIStore';
import UserStore from './UserStore';

configure({ enforceActions: true });

export default {
  currentModuleStore: new CurrentModuleStore(),
  currentUser: new CurrentUserStore(),
  homeworkStore: new HomeworkStore(),
  moduleStore: new ModuleStore(),
  timeline: new TimeLineStore(),
  ui: new UIStore(),
  userStore: new UserStore(),
};
