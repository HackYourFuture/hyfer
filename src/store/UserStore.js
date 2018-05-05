const token = localStorage.getItem("token")

class store {

<<<<<<< HEAD
	state = {
		currentUser: '',
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

	};
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
	async loadUser() {
		try {
			const res = await fetch('http://localhost:3000/api/user', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + token,
				}
			})
			const data = await res.json()
			this.setState({
				currentUser: data,
			});
			return;
		}

		catch (error) {
			console.log(error);
			throw new Error('Problem with Server: GET DATA');
		}
	}
	async loadUsers() {
		try {
			const res = await fetch('http://localhost:3000/api/users', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + token,
				}
			})
			const data = await res.json()
			this.setState({
				users: data,
				filteredUsers: data,
			});
			return;
		}
		catch (error) {
			console.log(error);
			throw new Error('Problem with Server: GET DATA');
		}
	}
	saveProfile = async (loadData) => {
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
		try {
			await fetch(`http://localhost:3005/api/user/${this.state.id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + token,
				},
				body: JSON.stringify(updatedUser),				
			})
			if (loadData === 'loadUser') {
				this.loadUser()
			} else if (loadData === 'loadUsers') {
				this.loadUsers()
			}
		}
		catch (error) {
			console.log(error)
			throw new Error('Problem with Server :  PATCH DATA')
		}
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
=======
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
        try {
            const res = await fetch('http://localhost:3000/api/users', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                }
            })
            const data = await res.json()
            await this.setState({
                users: data,
                filteredUsers: data,
            })
        } catch (error) {
            console.log(error)
            throw new Error('Problem with Server: GET DATA')
        }

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

        try {
            const response = await fetch(`http://localhost:3005/api/user/${this.state.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
                body: JSON.stringify(updatedUser),
            })
            if (response.status >= 400) {
                throw new Error("Bad response from server")
            }
            this.loadUsers()
        } catch (error) {

            console.log(error)
            throw new Error('Problem with Server :  PATCH DATA')
        }
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
        let updatedList = this.state.users
        updatedList = updatedList.filter((item) => {
            return (
                item.full_name.toLowerCase().search(event.target.value.toLowerCase()) !== -1
            )
        })
        this.setState({
            filteredUsers: updatedList
        })
    }
>>>>>>> upstream/master

}

export default new store()