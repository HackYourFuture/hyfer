import React from 'react';
import store from '../../store/UserStore';
import styles from '../../assets/styles/profile.css';


export default class Profile extends React.Component {

  componentWillMount = () => {
    this.subscription = store.subscribe(state => {
      this.setState(state);
    });
  }

  componentWillUnmount() {
    this.subscription.remove();
  }

  saveProfile = () => {

    const updatedUser = {
      "id": store.state.id,
      "username": store.state.username,
      "full_name": store.state.full_name,
      "role": store.state.role,
      "register_date": store.state.register_date,
      "slack_username": store.state.slack_username,
      "freecodecamp_username": store.state.freecodecamp_username,
      "email": store.state.email,
      "mobile": store.state.mobile,
      "group_id": store.state.group_id,
      "group_name": store.state.group_name
    }

    fetch(`http://localhost:3005/api/user/${store.state.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedUser), 
    })
      .then(response => console.log("RESPONSE", response))
      .catch((error) => {
        console.log(error)
        throw new Error('Problem with Server :  PATCH DATA')
    })  
  }

    render(){
        return (
        
        <div className={styles.profilePage}>
            <h1>Edit Profile</h1>
            <div className={styles.profileContainer}>
              <input className={styles.profileName} 
                     type="text" value={store.state.full_name} 
                     placeholder="Name " 
                     onChange={(e)=> {store.setState({full_name: e.target.value});
              }}/>
              <select value={store.state.role} 
                      onChange={(e)=> {store.setState({role: e.target.value});
              }}>
                <option value="guest" disabled hidden>Role</option>
                <option value="teacher">Teacher</option>
                <option value="student">Student</option>
              </select>
              <select value={store.state.group_name} 
                      onChange={(e)=> {store.setState({group_name: e.target.value});
              }}>
                <option value="" disabled hidden>Class</option>
                <option value="Class 6">Class 6</option>
                <option value="Class 7">Class 7</option>
                <option value="Class 8">Class 8</option>
                <option value="Class 9">Class 9</option>
                <option value="Class 10">Class 10</option>
                <option value="Class 11">Class 11</option>
                <option value="Class 12">Class 12</option>
                <option value="Class 13">Class 13</option>
                <option value="Class 14">Class 14</option>
                <option value="Class 14">Class 15</option>
              </select>
              <input type="email" 
                     value={store.state.email} 
                     placeholder="E-mail" 
                     onChange={(e)=> {store.setState({email: e.target.value});
                     }}/>
              <input type="text" 
                     value={store.state.slack_username} 
                     placeholder="Slack Username" 
                     onChange={(e)=> {store.setState({slack_username: e.target.value});
                     }} />
              <input type="text" 
                     value={store.state.freecodecamp_username} 
                     placeholder="FreeCodeCamp Username" 
                     onChange={(e)=> {store.setState({freecodecamp_username: e.target.value});
                     }}/>
              <input type="tel" 
                     value={store.state.mobile} 
                     placeholder="Mobile" 
                     onChange={(e)=> {store.setState({mobile: e.target.value});
                     }}/>

              <input className={styles.saveProfile} 
                     type="submit" 
                     value="Save" 
                     onClick={this.saveProfile}
                     />
              <input className={styles.resetProfile} 
                     type="submit" 
                     value="Reset" 
                     />            
            </div>
        </div>    
        )
    }
}