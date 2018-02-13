import TimelineStore from './TimeLineStore';
import ModuleInfoStore from './ModuleInfoStore';
import UiStore from './UiStore';
import moduleInfoStoreNoMobxFactory from './ModuleInfoStoreNoMobx';

export const timelineStore = (window.timelineStore = new TimelineStore());
export const moduleInfoStore = (window.moduleInfoStore = new ModuleInfoStore());
export const uiStore = (window.uiStore = new UiStore());
export const moduleInfoStoreNoMobx = (window.moduleInfoStoreNoMobx = moduleInfoStoreNoMobxFactory());

// types of changes

export const REPO_NAME_CHANGED = 'REPO_NAME_CHANGED';
export const READ_ME_CHANGED = 'README_CHANGED';
