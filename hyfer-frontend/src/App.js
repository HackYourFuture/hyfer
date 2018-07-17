import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import cookie from 'react-cookies';
import Notifications from 'react-notify-toast';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import MainAppBar from './components/MainAppBar';
import Popup from './components/Popup/Popup';
import TimelinePage from './routes/timeline/TimelinePage';
import HomeworkPage from './routes//homework/HomeworkPage';
import ModulesPage from './routes//modules/ModulesPage';
import TrainTicketPage from './routes//trainTicket/TrainTicketPage';
import UsersPage from './routes//users/UsersPage';

const PUBLIC_ROUTES = [
  { exact: true, path: '/timeline', component: TimelinePage },
];

const ROUTES = {
  teacher: [
    { exact: true, path: '/modules', component: ModulesPage },
    { exact: true, path: '/users', component: UsersPage },
    { exact: true, path: '/homework', component: HomeworkPage },
    { exact: true, path: '/homework/:classNumber', component: HomeworkPage },
    { exact: true, path: '/TrainTicket', component: TrainTicketPage },
  ],
  student: [
    { exact: true, path: '/homework', component: HomeworkPage },
    { exact: true, path: '/homework/:classNumber', component: HomeworkPage },
  ],
  guest: [
  ],
};

const defaultProfile = {
  username: 'guest',
  full_name: 'Guest',
  role: 'guest',
};

const styles = () => ({

});

@inject('currentUser')
@observer
class App extends Component {

  async componentDidMount() {
    let token = cookie.load('token');
    if (token) {
      token = JSON.parse(token);
      window.localStorage.setItem('token', token);
    }
    token = window.localStorage.getItem('token');
    if (token) {
      await this.props.currentUser.fetchCurrentUser();
    } else {
      window.localStorage.removeItem('token');
      this.setState({ profile: defaultProfile });
    }
  }

  render() {
    const { theme } = this.props;
    const { currentUser, isLoggedIn } = this.props.currentUser;
    const routes = isLoggedIn ? [...PUBLIC_ROUTES, ...ROUTES[currentUser.role]] : [...PUBLIC_ROUTES];
    const paddingTop = theme.mixins.toolbar.minHeight + theme.spacing.unit;

    return (
      <BrowserRouter>
        <React.Fragment>
          <CssBaseline />
          <MainAppBar />
          <div style={{ paddingTop }}>
            <Popup />
            <Notifications />
            <Switch>
              {routes.map(route => (<Route key={route.path} {...route} />))}
              <Redirect exact strict from="/" to="/timeline" />
            </Switch>
          </div>
        </React.Fragment>
      </BrowserRouter >
    );
  }
}

export default withStyles(styles, { withTheme: true })(App);

App.propTypes = {
  currentUser: PropTypes.object,
  theme: PropTypes.object.isRequired,
};
