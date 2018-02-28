function AttendObs() {

	this.observers = [];

	// State
    this.state = {
       
    }; 

	this.setState = (merge) => {
        let old = {};
        for (var k in merge) {
            if (this.state.hasOwnProperty(k)){
				old[k] = this.state[k];
			}
            this.state[k] = merge[k];
        }
        for (var f of this.observers){
			f(merge, old);
		};
		//console.log('state setted')
	};
	
	this.get = (k) => {
		//console.log('notified');
		return this.state[k];
	};
	
	this.subscribe = (f) => {
		this.observers.push(f);
		//console.log('subscribed');
    };

	this.unsubscribe = (f) => {
		this.observers = this.observers.filter(e => e !== f);
		//console.log('unsubscribed');

	};
};

export default new AttendObs()