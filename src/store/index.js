import TimelineStore from './TimeLineStore';
import ModuleInfoStore from './ModuleInfoStore';
import UiStore from './UiStore';

export const timelineStore = (window.timelineStore = new TimelineStore());
export const moduleInfoStore = (window.moduleInfoStore = new ModuleInfoStore());
export const uiStore = (window.uiStore = new UiStore());
