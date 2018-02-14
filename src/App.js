import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import './assets/styles/app.css';
import Header from './components/Header/Header';
import TimeLine from './Pages/Timeline/TimeLine';
import Footer from './components/Footer/Footer';
import Modules from './Pages/Modules/Modules'; // ADD YOURS HERE
import Users from './Pages/Users/Users'; // ADD YOURS HERE

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <Header />
          <Switch>
            <Route path="/timeline" exact component={TimeLine} />
            <Route path="/modules" exact component={Modules} />
            <Route path="/users" exact component={Users} />
            <Redirect from="/" to="/timeline" />
          </Switch>
          <Footer />
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
