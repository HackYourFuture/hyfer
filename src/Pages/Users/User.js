import React from 'react';
import styles from '../../assets/styles/users.css';

export default class User extends React.Component {
    
    // child component on Users component.
    // Just a static component
    // Details for each users' box
    render(){
        
        return (
        <li className={styles.user}>
            <img className={styles.userAvatar} src={`https://avatars.githubusercontent.com/${this.props.username}`} 
                 onError={(e)=>{e.target.src=`https://api.adorable.io/avatars/100/${this.props.full_name}`}}/>
            <div className ={styles.userName}>{this.props.full_name}</div>
            <div>{this.props.group_name}</div>
            <div>{this.props.role}</div>
            <div>{this.props.register_date}</div>
            <div>{this.props.email}</div>
            <div>{this.props.slack_username}</div>
            <div>{this.props.freecodecamp_username}</div>
            <div>{this.props.username}</div>
        </li>
        )
    }
} 