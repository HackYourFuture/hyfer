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
export const TIMELINE_ITEMS_CHANGED = 'TIMELINE_ITEMS_CHANGED';
export const TIMELINE_GROUPS_CHANGED = 'TIMELINE_GROUPS_CHANGED';
export const MODAL_STATE_CHANGED = 'MODAL_STATE_CHANGED';
export const LOGIN_STATE_CHANGED = 'LOGIN_STATE_CHANGED';
export const ISTEACHER_STATE_CHANGED = 'ISTEACHER_STATE_CHANGED';
export const AVATAR_URL_CHANGED = 'AVATAR_CHANGED';
export const HISTORY_CHANGED = 'HISTORY_CHANGED';
