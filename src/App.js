import React, { Component } from 'react'
import { inject, observer } from "mobx-react"
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import { studentClasses } from "../src/store/HomeworkStore"


import './assets/styles/app.css'
import Header from './components/Header/Header'
import TimeLine from './Pages/Timeline/TimeLine'
import Footer from './components/Footer/Footer'
import Modules from './Pages/Modules/Modules'
import Users from './Pages/Users/Users'
import currentUserProfile from './Pages/Users/currentUserProfile'
import userAccount from './Pages/Users/userAccount'
import Profile from './Pages/Users/Profile'
import TrainTicket from './Pages/TrainTicket/TrainTicket'
import ClassPage from "./Pages/Homework/ClassPage"
import cookie from 'react-cookies'

@inject("HomeworkStore")
@observer    
class App extends Component {
  
  componentWillMount() {
    
    let token = cookie.load('token')
    if(token && typeof token !== 'undefined'){
      token = JSON.parse(token)
    }
    else{
      token = ''
    }
    localStorage.setItem('token', token)
  }

    render() {
        const { activeGroups } = this.props.HomeworkStore
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
                render={props => <ClassPage {...props} studentClass={activeGroups[0]} />} />
                    
            {activeGroups.map(group => (
                <Route key={group} path={"/homework/" + group} exact
                    render={props => <ClassPage {...props} studentClass={group} />} />
            ))}  
            <Route path="/currentUserProfile" exact component={currentUserProfile} />
            <Route path="/userAccount" exact component={userAccount} /> 
            <Route path="/TrainTicket" exact component={TrainTicket}/>
            <Redirect from="/" to="/timeline" />
          </Switch>
          <Footer />
        </React.Fragment>
      </BrowserRouter>
    )
  }
}

export default App
