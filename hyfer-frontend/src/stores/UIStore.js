import { action, observable } from 'mobx';

export default class UIStore {

  @observable
  lastError = null;

  @observable
  notification = null;

  @observable
  successMessage = null;

  @observable
  warningMessage = null;

  @observable
  timelineTabIndex = 0;

  @action
  setLastError = (error) => this.notification = { variant: 'success', messsage: error.message };

  @action
  clearNotification = () => this.notification = null;

  @action
  setSuccessMessage = (message) => this.notification = { variant: 'success', message };


  @action
  setWarningMessage = (message) => this.notification = { variant: 'warning', message };


  @action
  clearWarningMessage = () => this.warningMessage = null;

  @action
  setTimelineTabIndex = (value) => this.timelineTabIndex = value;
}
