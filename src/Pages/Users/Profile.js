import React from 'react';
//import store from '../../store/UserStore';
import styles from '../../assets/styles/profile.css';

/* 
Only the static part of the profile page has done yet, still can be upgraded..

Need to get the values from the forms and "POST" to the the server.
*/

export default class Profile extends React.Component {

    render(){
        
        return (
        
        <div className={styles.profilePage}>
            <h1>Edit Profile</h1>
            <div className={styles.profileContainer}>
              <input className={styles.profileName} type="text" placeholder="Name" />
              <select>
                <option value="" disabled selected hidden>Role</option>
                <option value="">Teacher</option>
                <option value="">Student</option>
              </select>
              <select>
                <option value="" disabled selected hidden>Class</option>
                <option value="">Class 10</option>
                <option value="">Class 11</option>
                <option value="">Class 12</option>
                <option value="">Class 13</option>
                <option value="">Class 14</option>
                <option value="">Class 15</option>
              </select>
              <input type="email" placeholder="E-mail" />
              <input type="text" placeholder="Slack Username" />
              <input type="text" placeholder="FreeCodeCamp Username" />
              <input type="tel" placeholder="Mobile" />
              
              <input className={styles.resetProfile} type="submit" value="Reset" />
              <input className={styles.saveProfile} type="submit" value="Save" />
            </div>
        </div>    

        )
    }
}