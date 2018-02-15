import React from 'react';

export default class User extends React.Component {
    
    // child component on Users component.
    // Just a static component
    // Details for each users' box
    render(){
        
        return (
        <li className="user">
            <img className="user-avatar" src={`https://avatars.githubusercontent.com/${this.props.username}`} 
                 onError={(e)=>{e.target.src=`https://api.adorable.io/avatars/100/${this.props.full_name}`}}/>
            <div className ="user-name">{this.props.full_name}</div>
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