import { action, observable } from 'mobx';

export default class UIStore {

  @observable
  notification = null;

  @action
  reportError = ({ message }) => this.notification = { variant: 'error', message };

  @action
  reportSuccess = (message) => this.notification = { variant: 'reportSuccess', message };

  @action
  reportWarning = (message) => this.notification = { variant: 'warning', message };

  @action
  clear = () => this.notification = null;
}
