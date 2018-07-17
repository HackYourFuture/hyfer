import { action, observable } from 'mobx';

export default class UIStore {

  @observable
  lastError = null;

  @observable
  successMessage = null;

  @observable
  warningMessage = null;

  @observable
  timelineTabIndex = 0;

  @action
  setLastError = (error) => {
    this.lastError = error;
    throw error;
  };

  @action
  clearLastError = () => this.lastError = null;

  @action
  setSuccessMessage = (message) => this.successMessage = message;

  @action
  clearSuccessMessage = () => this.successMessage = null;

  @action
  setWarningMessage = (warning) => this.warningMessage = warning;

  @action
  clearWarningMessage = () => this.warningMessage = null;

  @action
  setTimelineTabIndex = (value) => this.timelineTabIndex = value;
}
