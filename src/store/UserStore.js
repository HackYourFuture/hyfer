import locals from '../util/locals'

const token = localStorage.getItem("token")

class store {

    state = {
        users: [],
        filteredUsers: [],

        id: [],
        username: [],
        full_name: [],
        group_name: [],
        role: [],
        register_date: [],
        email: [],
        slack_username: [],
        freecodecamp_username: [],
        mobile: [],
        group_id: [],

        reset_id: [],
        reset_username: [],
        reset_full_name: [],
        reset_group_name: [],
        reset_role: [],
        reset_register_date: [],
        reset_email: [],
        reset_slack_username: [],
        reset_freecodecamp_username: [],
        reset_mobile: [],
        reset_group_id: [],

        mobileActive: false,
        slackActive: false
    }

    notify = () => {
        for (const handler of this.handlers) {
            handler(this.state)
        }
    }

    setState = (updates) => {
        Object.assign(this.state, updates)
        this.notify()
    }

    // Subscriptions

    handlers = new Set()

    subscribe = (handler) => {
        this.handlers.add(handler)
        handler(this.state)
        return {
            remove: () => {
                this.handlers.delete(handler)
            }
        }
    }


    loadUsers = async () => {
        const error = () => {
            // no need for the console in a production mode
            // -- instead we will throw a helpfull message
            throw new Error('Problem with Server: GET DATA')
        }
        const res = await locals.request(process.env.REACT_APP_API_USERS_LIST_URL, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            }
        }, error)
        const jsonRes = await res.json().catch(error)
        this.setState({
            users: jsonRes,
            filteredUsers: jsonRes,
        })
    }

    saveProfile = async () => {
        const updatedUser = {
            "id": this.state.id,
            "username": this.state.username,
            "full_name": this.state.full_name,
            "group_name": this.state.group_name,
            "role": this.state.role,
            "register_date": this.state.register_date,
            "email": this.state.email,
            "slack_username": this.state.slack_username,
            "freecodecamp_username": this.state.freecodecamp_username,
            "mobile": this.state.mobile,
            "group_id": this.state.group_id
        }
        const error = () => {
            throw new Error('Problem with Server :  PATCH DATA')
        }
        const { REACT_APP_CURRENT_API_USER_INFO_URL } = process.env
        const res = await locals.request(`${REACT_APP_CURRENT_API_USER_INFO_URL}/${this.state.id}`, {
            method: 'PATCH',
            body: updatedUser,
        }, error)
        if (res.status >= 400) {
            throw new Error("Bad response from server");
        }
        this.loadUsers()
        console.log(this.state.full_name)
    }

    resetProfile = () => {
        this.setState({
            id: this.state.reset_id,
            username: this.state.reset_username,
            full_name: this.state.reset_full_name,
            group_name: this.state.reset_group_name,
            role: this.state.reset_role,
            register_date: this.state.reset_register_date,
            email: this.state.reset_email,
            slack_username: this.state.reset_slack_username,
            freecodecamp_username: this.state.reset_freecodecamp_username,
            mobile: this.state.reset_mobile,
            group_id: this.state.reset_group_id
        })
    }

    // filter by user full_name(I think it's more specific)
    searchUser = (event) => {
        let updatedList = this.state.users;
        updatedList = updatedList.filter((item) => {
            return (
                item.full_name.toLowerCase().search(event.target.value.toLowerCase()) !== -1
            );
        });
        this.setState({
            filteredUsers: updatedList
        });
    };

}

export default new store()
