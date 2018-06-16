import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import './assets/styles/app.css';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import cookie from 'react-cookies';
import Notifications from 'react-notify-toast';
import Popup from './components/Popup';
// import userStore from './store/UserStore';
import TimeLine from './Pages/Timeline/TimeLine';
import Modules from './Pages/Modules/Modules';
import Users from './Pages/Users/Users';
import currentUserProfile from './Pages/Users/currentUserProfile';
import userAccount from './Pages/Users/userAccount';
import Profile from './Pages/Users/Profile';
import TrainTicket from './Pages/TrainTicket/TrainTicket';
import Homework from './Pages/Homework/Homework';
import {observer , inject} from 'mobx-react';

const PUBLIC_ROUTES = [
  { exact: true, path: '/timeline', component: TimeLine },
];

const ROUTES = {
  teacher: [
    { exact: true, path: '/modules', component: Modules },
    { exact: true, path: '/users', component: Users },
    { exact: true, path: '/profile', component: Profile },
    { exact: true, path: '/userAccount', component: userAccount },
    { exact: true, path: '/homework', component: Homework },
    { exact: true, path: '/homework/:classNumber', component: Homework },
    { exact: true, path: '/TrainTicket', component: TrainTicket },
  ],
  student: [
    { exact: true, path: '/homework', component: Homework },
    { exact: true, path: '/homework/:classNumber', component: Homework },
  ],
  guest: [
    { exact: true, path: '/currentUserProfile', component: currentUserProfile },
  ],
};

const defaultProfile = {
  username: 'guest',
  full_name: 'Guest',
  role: 'guest',
};
@inject('userStore')
@observer 
class App extends Component {

  state = {};

  async componentDidMount() {
    let token = cookie.load('token');
    if (token) {
      token = JSON.parse(token);
      window.localStorage.setItem('token', token);
      await this.props.userStore.loadUser();
      this.setState({ profile: this.props.userStore.currentUser });
    } else {
      window.localStorage.removeItem('token');
      this.setState({ profile: defaultProfile });
    }
  }

  render() {
    const { profile } = this.state;
  // this.props.userStore.loadUser();
  // console.log(this.props.userStore.currentUser);
    console.log(profile);
    if (profile == null) {
      return null;
    }

    const routes = [...PUBLIC_ROUTES, ...ROUTES[profile.role]];

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
      </BrowserRouter>
    );
  }
}

export default App;
