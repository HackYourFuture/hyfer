import TimelineStore from './TimeLineStore';
import ModuleInfoStore from './ModuleInfoStore';

export const timelineStore = (window.timelineStore = new TimelineStore());
export const moduleInfoStore = (window.moduleInfoStore = new ModuleInfoStore());
