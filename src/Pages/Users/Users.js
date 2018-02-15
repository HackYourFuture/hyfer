import React from 'react';
import User from './User';
import store from '../../store/UserStore';
import styles from '../../assets/styles/users.css';



export default class Users extends React.Component {

    
    componentWillMount = () => {
        this.subscription = store.subscribe(state => {
            this.setState(state)
        })
    }    
    
    // componentWillMount= () => {
    //     this.setState({filteredUsers: store.state.users})
    //   }
    
    componentWillUnmount() {
        this.subscription.remove()
        //clearInterval(this.interval);
    }  
    
    // loads the user from API, it fethces from state
    componentDidMount = () => {
        this.loadUsers();
        //this.interval = setInterval(this.loadUsers(), 1000);
    };
    

    // fetch the users data from API
    loadUsers(){
        fetch("http://localhost:3000/api/users")
        .then(res => res.json())
        .then(json => {
            store.setState({
                users: json
            });
            return;
        })
        .catch(error => {
            console.log(error);
        })
    }

    //evethandler for SEARCH, there is a problem working on it.
    //it filters, but doesnt re-show the eleminated users..
    // may be need to carry the handlers to a different component.
    filterList = function(event){
        var updatedList = store.state.users;
        console.log(updatedList)
        updatedList = updatedList.filter(function(item){
          return item.username.toLowerCase().search(
            event.target.value.toLowerCase()) !== -1;
        });
        store.setState({
            users: updatedList
        });
    }
 

    
    // There 2 different focus, one is SEARCH input and rendering each USERS in the API
    render() {
        return (

            <div className="filter-list">
                <input className="user-list-input" type="text" placeholder="lookup someone" onChange={this.filterList}/>
                
                <ul className = "user-list">
                        {store.state.users.map((user, i) => (                        
                                <React.Fragment key={user.id}>
                                    <User   full_name = {user.full_name}
                                            group_name = {user.group_name}
                                            role = {user.role}
                                            register_date = {user.register_date}
                                            email = {user.email}
                                            slack_username = {user.slack_username}
                                            freecodecamp_username = {user.freecodecamp_username}
                                            username = {user.username}/>
                                </React.Fragment> 
                        ))}
                </ul>
            </div>     
        )
    }
}
