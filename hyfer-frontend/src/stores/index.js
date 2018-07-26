import { configure } from 'mobx';

import CurrentModuleStore from './CurrentModuleStore';
import CurrentUserStore from './CurrentUserStore';
import HomeworkStore from './HomeworkStore';
import ModuleStore from './ModuleStore';
import TimeLineStore from './TimeLineStore';
import UIStore from './UIStore';
import UserStore from './UserStore';

configure({ enforceActions: true });

export const CLASS_SELECTION_CHANGED = 'CLASS_SELECTION_CHANGED';

export default {
  currentModule: new CurrentModuleStore(),
  currentUser: new CurrentUserStore(),
  homeworkStore: new HomeworkStore(),
  moduleStore: new ModuleStore(),
  timeline: new TimeLineStore(),
  uiStore: new UIStore(),
  userStore: new UserStore(),
};
