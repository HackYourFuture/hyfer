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

	};
	loadUsers = () => {
		fetch('http://localhost:3000/api/users', {
			headers: {
				'Authorization': 'Bearer ' + token,
			}
		})
			.then(res => res.json())
			.then(res => {
				this.setState({
					users: res,
					filteredUsers: res
				});
				return;
			})
			.catch(error => {
				console.log(error);
				throw new Error('Problem with Server: GET DATA');
			});
	}
	notify = () => {
		for (const handler of this.handlers) {
			handler(this.state)
		}
	}
	setState=(updates)=> {
		Object.assign(this.state, updates)
		this.notify()
	}

	// Subscriptions

	handlers = new Set()

	subscribe=(handler)=> {
		this.handlers.add(handler)
		handler(this.state)
		return {
			remove: () => {
				this.handlers.delete(handler)
			}
		}
	}

	saveProfile = () => {
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

		fetch(`http://localhost:3005/api/user/${this.state.id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token,
			},
			body: JSON.stringify(updatedUser),
		})
			.then(response => console.log("RESPONSE", response))
			.catch((error) => {
				console.log(error)
				throw new Error('Problem with Server :  PATCH DATA')
			})
		this.loadUsers()
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
