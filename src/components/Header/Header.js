import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'

import hyfIcon from '../../assets/images/icon.png'
import styles from '../../assets/styles/header.css'
import {
    uiStore,
    AVATAR_URL_CHANGED,
} from '../../store'
import cookie from 'react-cookies'

import { errorMessage } from '../../notify'
import { Consumer } from '../../Provider'

export default class Header extends Component {
    state = {
        isLoggedIn: false,
        isATeacher: false,
        isStudent: false,
        done: false,
        avatarUrl: null
    }

    componentDidMount = () => {
        uiStore.subscribe(mergedData => {
            if (mergedData.type === AVATAR_URL_CHANGED)
                this.setState({ avatarUrl: mergedData.payload.avatarUrl })
        })

        const token = localStorage.getItem('token')
        let login = false
        if (token && token !== '') login = true

        if (login) {
            uiStore.getUserInfo().catch(errorMessage)
        }
    }

    SignOut = () => {
        localStorage.removeItem('token')
        cookie.save('token', '')
    }

    render() {

        return (
            <Consumer>{appStore => {
                // collecting the main state from appStore
                const { auth, routes, lifeCycle: { done } } = appStore.state.main

                // setting up the role on the whole page
                if (auth.isATeacher && this.state.isATeacher !== auth.isATeacher)
                    this.setState({ isATeacher: auth.isATeacher })

                // setting up the role on the whole page
                if (auth.isStudent && this.state.isStudent !== auth.isStudent)
                    this.setState({ isStudent: auth.isStudent })

                // setting up the role on the whole page
                if (auth.isLoggedIn && this.state.isLoggedIn !== auth.isLoggedIn)
                    this.setState({ isLoggedIn: auth.isLoggedIn })

                // setting up the done lifeCycle on the whole page
                if (done && this.state.done !== done)
                    this.setState({ done })

                const visitor = (
                    <div className={styles.signInWrapper}>
                        <div className={styles.visitorWrapper}>
                            <span className={styles.visitor}>Visitor</span>
                        </div>
                        <div className={styles.signButtonWrapper}>
                            <a
                                href="http://localhost:3005/auth/github"
                                className={styles.signInButton}
                            >Sign in</a>
                        </div>
                    </div>
                )
                const user = (
                    <ul className={styles.signed_in}>
                        <li>
                            <img
                                src={this.state.avatarUrl}
                                alt="user icon"
                                className={styles.userIcon}
                            />
                        </li>
                        <ul className={styles.subNav}>
                            <li >
                                <a href="http://localhost:3000/"
                                    onClick={this.SignOut}
                                >
                                    <span className={styles.subNavItem}>Sign Out</span>
                                </a>
                            </li>
                            <li>
                                {   // if there is a label the page will shows up here
                                    routes.filter(item => item.label).map(route => (
                                        <NavLink key={route.label} exact to={route.path}>
                                            <span className={styles.subNavItem}>{route.label}</span>
                                        </NavLink>
                                    ))
                                }
                            </li>
                        </ul>
                    </ul>
                )
                return (
                    <React.Fragment>
                        <header className={styles.header}>
                            <a href="http://hackyourfuture.net/">
                                <img
                                    src={hyfIcon}
                                    alt="HackYourFuture logo"
                                    className={styles.hyfIcon}
                                />
                            </a>
                            <nav className={styles.nav}>
                                <ul className={styles.list}>
                                    {   // if there is a name instead of the label the page will shows up here
                                        routes.filter(item => item.name).map(route => (
                                            <li key={route.name}>
                                                <NavLink
                                                    key={route.path}
                                                    exact
                                                    to={route.path}
                                                    className={styles.item}
                                                    activeClassName={styles.activeNav}
                                                >{route.name}</NavLink>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </nav>
                            {/* if there is no label or a name the page will ba ignored */}
                            {done && !this.state.isLoggedIn && visitor}
                            {done && this.state.isLoggedIn && user}
                        </header>
                    </React.Fragment>
                )
            }}</Consumer>
        )
    }
}
