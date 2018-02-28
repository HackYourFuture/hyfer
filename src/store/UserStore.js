  
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






// class store {
//     observers = []
//     // State
//     state = {
//         users: []
        
//     }; 
    
//     setState = (merge) => {
//         let old = {}
//         for (var k in merge) {
//             if (this.state.hasOwnProperty(k)){
//                 old[k] = this.state[k]
//             }
//             this.state[k] = merge[k]
//         }
//         for (var f of this.observers){
//             f(merge, old)
//         }
//     }
    
//     get = (k) => {
//         return this.state[k]
//     }
    
//     subscribe = (f) => {
//         this.observers.push(f)
//     }
//     unsubscribe = (f) => {
//         this.observers = this.observers.filter(e => e !== f)
//     }
// }

// export default new store()


  