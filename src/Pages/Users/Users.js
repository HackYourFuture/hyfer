import React from 'react'
import store from '../../store/UserStore'
import styles from '../../assets/styles/users.css'
import Guest from '../../components/Users/Guest'
import Teachers from '../../components/Users/Teachers'
import Students from '../../components/Users/Students'
import SynchronizeGithubData from '../../components/Users/SynchronizeGithubData'

export default class Users extends React.Component {

  componentWillMount = () => {
    this.subscription = store.subscribe(state => {
      this.setState(state)
    })
  }

  componentWillUnmount() {
    this.subscription.remove()
  }

  componentDidMount = () => {
    store.loadUsers()
    window.scrollTo(0, 0)
  }

  

  render() {
      return (
        
          <div>
              <div className={styles.userSearchDiv}>
                  <input
                      className={styles.userSearchBox}
                      type="text"
                      placeholder="lookup someone"
                      onChange={store.searchUser}
                  />
                  <SynchronizeGithubData />
              </div>
              <div>
                  <ul className={styles.mainUl}>
                      <Guest />
                      <Teachers />
                      <Students />
                  </ul>
              </div>
          </div>
    )
  }
}
