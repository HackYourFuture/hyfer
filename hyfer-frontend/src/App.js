import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import cookie from 'react-cookies';
import Notifications from 'react-notify-toast';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import './assets/styles/app.css';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import Popup from './components/Popup';
import Homework from './Pages/Homework/Homework';
import Modules from './Pages/Modules/Modules';
import TimeLine from './Pages/Timeline/TimeLine';
import TrainTicket from './Pages/TrainTicket/TrainTicket';
import CurrentUserProfile from './Pages/Users/CurrentUserProfile';
import Profile from './Pages/Users/Profile';
import UserAccount from './Pages/Users/UserAccount';
import Users from './Pages/Users/Users';

const PUBLIC_ROUTES = [
  { exact: true, path: '/timeline', component: TimeLine },
];

const ROUTES = {
  teacher: [
    { exact: true, path: '/modules', component: Modules },
    { exact: true, path: '/users', component: Users },
    { exact: true, path: '/profile', component: Profile },
    { exact: true, path: '/userAccount', component: UserAccount },
    { exact: true, path: '/homework', component: Homework },
    { exact: true, path: '/homework/:classNumber', component: Homework },
    { exact: true, path: '/TrainTicket', component: TrainTicket },
  ],
  student: [
    { exact: true, path: '/homework', component: Homework },
    { exact: true, path: '/homework/:classNumber', component: Homework },
  ],
  guest: [
    { exact: true, path: '/currentUserProfile', component: CurrentUserProfile },
  ],
};

const defaultProfile = {
  username: 'guest',
  full_name: 'Guest',
  role: 'guest',
};

@inject('global')
@observer
class App extends Component {

  async componentDidMount() {
    let token = cookie.load('token');
    if (token) {
      token = JSON.parse(token);
      window.localStorage.setItem('token', token);
      await this.props.global.fetchCurrentUser();
    } else {
      window.localStorage.removeItem('token');
      this.setState({ profile: defaultProfile });
    }
  }

  render() {
    const { currentUser } = this.props.global;

    if (currentUser == null) {
      return null;
    }

    const routes = [...PUBLIC_ROUTES, ...ROUTES[currentUser.role]];

    return (
      <BrowserRouter>
        <React.Fragment>
          <Header />
          <Popup />
          <Notifications />
          <Switch>
            {routes.map(route => (<Route key={route.path} {...route} />))}
            <Redirect exact strict from="/" to="/timeline" />
          </Switch>
          <Footer />
        </React.Fragment>
      </BrowserRouter >
    );
  }
}

export default App;
