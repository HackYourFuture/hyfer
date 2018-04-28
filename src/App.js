import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { studentClasses } from "../src/store/HomeworkStore"


import './assets/styles/app.css';
import Header from './components/Header/Header';
import TimeLine from './Pages/Timeline/TimeLine';
import Footer from './components/Footer/Footer';
import Modules from './Pages/Modules/Modules';
import Users from './Pages/Users/Users';
import Profile from './Pages/Users/Profile';
import ClassPage from "./Pages/Homework/ClassPage"
import cookie from 'react-cookies';

class App extends Component {
  
  componentWillMount() {
    
    let token = cookie.load('token')
    if(token && typeof token !== 'undefined'){
      token = JSON.parse(token)
    }
    else{
      token = ''
    }
    localStorage.setItem('token', token);
  }

    render() {
        const activeClasses = Object.keys(studentClasses)
    return (
      <BrowserRouter>
        <React.Fragment>
          <Header />
          <Switch>
            <Route path="/timeline" exact component={TimeLine} />
            <Route path="/modules" exact component={Modules} />
            <Route path="/users" exact component={Users} /> 
            <Route path="/profile" exact component={Profile} />
            <Route path="/homework" exact
                render={props => <ClassPage {...props} studentClass="class12" />} />
                {activeClasses.map(group => (
                <Route key={group} path={"/homework/" + group} exact
                    render={props => <ClassPage {...props} studentClass={group} />} />
            ))}        
            <Redirect from="/" to="/timeline" />
          </Switch>
          <Footer />
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
