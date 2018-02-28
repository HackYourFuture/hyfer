import React from 'react';
import store from '../../store/UserStore';
import styles from '../../assets/styles/users.css';
import { Link } from 'react-router-dom';

import FaGraduationCap from 'react-icons/lib/fa/graduation-cap';
import FaClockO from 'react-icons/lib/fa/clock-o';
import MdEmail from 'react-icons/lib/md/email';
import FaSlack from 'react-icons/lib/fa/slack';
import FaFire from 'react-icons/lib/fa/fire';
import FaGithub from 'react-icons/lib/fa/github';
import MdClass from 'react-icons/lib/md/class';


export default class Users extends React.Component {

  componentWillMount = () => {
    this.subscription = store.subscribe(state => {
      this.setState(state);
    });
  };

  componentWillUnmount() {
    this.subscription.remove();
  }

  // loads the user from API, it fethces from state
  componentDidMount = () => {
    this.loadUsers();
  };

  // fetch the users data from API
  // mounts to the <users> state
  loadUsers() {
    fetch('http://localhost:3000/api/users')
      .then(res => res.json())
      .then(json => {
        store.setState({
          users: json,
          filteredUsers: json
        });
        return;
      })
      .catch(error => {
        console.log(error);
        throw new Error('Problem with Server: GET DATA')
      });
  }

  //evethandler for SEARCH.
  filterList = function(event) {
    var updatedList = store.state.users;
    
    updatedList = updatedList.filter(function(item) {
      return (
        item.username.toLowerCase().search(event.target.value.toLowerCase()) !==-1
      );
    });
    store.setState({
      filteredUsers: updatedList
    });
  };

  
  render() {
    return (
      <div className={styles.filterList}>
        <input
          className={styles.userListInput}
          type="text"
          placeholder="lookup someone"
          onChange={this.filterList}
        />

        <ul className={styles.userList}>
          {store.state.filteredUsers.map((user, i) => (
            <React.Fragment key={user.id}>
              <li className={styles.user}>
                <div>
                  <img className={styles.userAvatar} 
                       src={`https://avatars.githubusercontent.com/${user.username}`} 
                       alt={`Profile - ${user.username}`}
                       onError={(e)=>{e.target.src=`https://api.adorable.io/avatars/100/${user.full_name}`} }/>
                  <div className ={styles.userName}>{user.full_name}</div>
                  <div><MdClass />{user.group_name}</div>
                  <div><FaGraduationCap/> {user.role}  </div>
                  <div><FaClockO />{user.register_date}</div>
                  <div><MdEmail />{user.email}</div>
                  <div><FaSlack />{user.slack_username}</div>
                  <div><FaFire />{user.freecodecamp_username}</div>
                  <div><FaGithub />{user.username}</div>
                </div>
                <form className = {styles.editUser} onClick={()=>{ 
                  console.log("FROM EDIT BUTTON",user)
                  store.setState({
                    id: user.id,
                    username:user.username,
                    full_name: user.full_name,
                    group_name: user.group_name,
                    role: user.role,
                    register_date:user.register_date,
                    email: user.email,
                    slack_username: user.slack_username,
                    freecodecamp_username: user.freecodecamp_username,
                    mobile: user.mobile,
                    group_id:user.group_id
                  });
                
                } }>  
                  <Link to='/profile'>
                    <button type="submit">EDIT</button>
                  </Link>
                </form>              
              </li> 
            </React.Fragment>
          ))}
        </ul>
      </div>
    );
  }
}
