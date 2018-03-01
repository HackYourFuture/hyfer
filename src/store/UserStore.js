  
class store {

	//------
	// State 

	state = {
        users: [],
		filteredUsers: [],

		id:[],
		username:[],
		full_name: [],
		group_name: [],
		role: [],
		register_date: [],
		email: [],
		slack_username: [],
		freecodecamp_username: [],
		mobile: [],
		group_id: []
		           
    }; 

	setState(updates) {
		Object.assign(this.state, updates)
		this.notify()
	}

	//------
	// Subscriptions

	handlers = new Set()

	subscribe(handler) {
		this.handlers.add(handler)
		handler(this.state)

		return {
			remove: () => {
				this.handlers.delete(handler)
			}
		}
	}

	notify() {
		for (const handler of this.handlers) {
			handler(this.state)
		}
	}

}

export default new store()