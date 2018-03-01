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
      "group_name": store.state.group_name,
      "role": store.state.role,
      "register_date": store.state.register_date,
      "email": store.state.email,
      "slack_username": store.state.slack_username,
      "freecodecamp_username": store.state.freecodecamp_username,
      "mobile": store.state.mobile,
      "group_id": store.state.group_id
      
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
              <select defaultValue="Class"
                      onChange={(e)=> {store.setState({group_name: JSON.parse(e.target.value).name, group_id: +JSON.parse(e.target.value).id});
              }}>
                <option value="Class" disabled hidden>Class</option>
                <option value='{"name":"Class 6","id":"44"}'>Class 6</option>
                <option value='{"name":"Class 7","id":"45"}'>Class 7</option>
                <option value='{"name":"Class 8","id":"46"}'>Class 8</option>
                <option value='{"name":"Class 9","id":"47"}'>Class 9</option>
                <option value='{"name":"Class 10","id":"48"}'>Class 10</option>
                <option value='{"name":"Class 11","id":"49"}'>Class 11</option>
                <option value='{"name":"Class 12","id":"50"}'>Class 12</option>
                <option value='{"name":"Class 13","id":"51"}'>Class 13</option>
                <option value='{"name":"Class 14","id":"52"}'>Class 14</option>
                <option value='{"name":"Class 15","id":"53"}'>Class 15</option>
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
                     type="reset" 
                     value="Reset" 
                     />            
            </div>
        </div>    
        )
    }
}