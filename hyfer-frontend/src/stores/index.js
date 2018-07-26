import { configure } from 'mobx';

import CurrentModuleStore from './CurrentModuleStore';
import CurrentUserStore from './CurrentUserStore';
import HomeworkStore from './HomeworkStore';
import ModulesStore from './ModulesStore';
import TimeLineStore from './TimeLineStore';
import NotificationStore from './NotificationStore';
import UsersStore from './UsersStore';

configure({ enforceActions: true });

export const CLASS_SELECTION_CHANGED = 'CLASS_SELECTION_CHANGED';

export default {
  currentModule: new CurrentModuleStore(),
  currentUser: new CurrentUserStore(),
  homeworkStore: new HomeworkStore(),
  modulesStore: new ModulesStore(),
  timeline: new TimeLineStore(),
  notification: new NotificationStore(),
  users: new UsersStore(),
};
