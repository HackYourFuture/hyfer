import ModuleInfoStore from './ModuleInfoStore';
import TimelineStore from './TimeLineStore';
import UiStore from './UiStore';

// stores

export const moduleInfoStore = (window.moduleInfoStore = ModuleInfoStore());
export const timelineStore = (window.timelineStore = TimelineStore());
export const uiStore = (window.uiStore = UiStore());

// types of changes

export const REPO_NAME_CHANGED = 'REPO_NAME_CHANGED';
export const READ_ME_CHANGED = 'README_CHANGED';
export const LOGIN_STATE_CHANGED = 'LOGIN_STATE_CHANGED';
export const ISTEACHER_STATE_CHANGED = 'ISTEACHER_STATE_CHANGED';
export const AVATAR_URL_CHANGED = 'AVATAR_CHANGED';
export const HISTORY_CHANGED = 'HISTORY_CHANGED';

export const TIMELINE_GROUPS_CHANGED = 'TIMELINE_GROUPS_CHANGED';
export const TIMELINE_ITEMS_CHANGED = 'TIMELINE_ITEMS_CHANGED';
export const ALL_WEEKS_CHANGED = 'ALL_WEEKS_CHANGED';
export const TODAY_MARKER_REFERENCE = 'TODAY_MARKER_REFERENCE';
export const SELECTED_MODULE_ID_CHANGED = 'SELECT_MODULE_CHANGED';
export const ALL_POSSIBLE_MODULES_CHANGED = 'ALL_POSSIBLE_MODULES_CHANGED';
export const ALL_SUNDAYS_CHANGED = 'ALL_SUNDAYS_CHANGED';
export const GROUPS_WITH_IDS_CHANGED = 'GROUPS_WITH_IDS_CHANGED';
export const ALL_TEACHERS_CHAGNED = 'ALL_TEACHERS_CHAGNED';
export const INFO_SELECTED_MDOULE_CHANGED = 'INFO_SELECTED_MDOULE_CHANGED';
