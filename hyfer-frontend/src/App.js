import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { withTheme } from '@material-ui/core/styles';
import NotificationSnackbar from './components/NotificationSnackbar';
import cookie from 'react-cookies';
import MainAppBar from './components/MainAppBar';
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

@inject('currentUser', 'ui')
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
      await this.props.currentUser.fetchUser();
    } else {
      window.localStorage.removeItem('token');
    }
  }

  render() {
    const { theme, ui } = this.props;
    const { role, isLoggedIn } = this.props.currentUser;
    const routes = isLoggedIn ? [...PUBLIC_ROUTES, ...ROUTES[role]] : [...PUBLIC_ROUTES];
    const paddingTop = theme.mixins.toolbar.minHeight + theme.spacing.unit;

    return (
      <BrowserRouter>
        <React.Fragment>
          <CssBaseline />
          <MainAppBar />
          <div style={{ paddingTop }}>
            {ui.notification && <NotificationSnackbar />}
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

export default withTheme()(App);

App.wrappedComponent.propTypes = {
  currentUser: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  ui: PropTypes.object.isRequired,
};
