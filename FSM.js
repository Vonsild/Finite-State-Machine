class FSM {
	constructor(initial_state, states) {
		if (!states[initial_state]) throw new Error(`Undefined initial state "${initial_state}"`);

		this['__events'] = new Map();
		this['states'] = states;
		this.set_state(initial_state);
	}

	set_state(state, state_value) {
		//Make sure the desired state is defined
		if (this['states'][state] === undefined) throw new Error(`Undefined state "${state}"`);

		if (this['state']) {
			//Remove previous state's transitions
			Object.getOwnPropertyNames(this['states'][this['state']]).forEach((val) => delete this[val]);
		}

		//Set current state
		this['state'] = state;

		var me = this;
		//Attach new transitions
		Object.getOwnPropertyNames(this['states'][this['state']]).forEach((val) => Object.defineProperty(this, val, {
			enumerable : true,
			configurable : true,
			writable : false,
			value : me['states'][me['state']][val].bind(me)
		}));
	}

	//Factory function - wraps the `transition` function, makes sure it's called in the correct context
	static transition(next_state, transition) {
		return function(...args) {
			try {
				var response = transition.apply(this, args);
			} catch (error) {
				//Do something about that.
				console.error(error);
				//Then return (don't change state)
				return;
			}

			//If response is NOT a falsey value, go to next state
			if (response) {
				let previous_state = this.state;
				this.set_state(next_state, (response.prototype instanceof Object) ? response : null);

				let event = new CustomEvent('state-change', {detail : {'state' : next_state, 'previous' : previous_state}});
				// "dispatchEvent"
				this.dispatchEvent(event);
				// done dispatching event

				return response;
			}
		}
	}

	//Add event functionality
	addEventListener(type, listener){
		var listeners = this.__events.get(type);
		if (!listeners) {
			var listeners = new Set();
			listeners.add(listener);
			this.__events.set(type, listeners);
		} else {
			listeners.add(listener);
		}
	}

	removeEventListener(type, listener){
		var listeners = this.__events.get(type);
		if (listeners) {
			listeners.delete(listener);
			if (listeners.size === 0) {
				this.__events.delete(type);
			}
		}
	}

	dispatchEvent(event){
		var listeners = this.__events.get(event.type);
		if(listeners){
			for(let listener of listeners){
				setTimeout(listener.call(null, event), 0);
			}
		}
	}

  	//Shorthand alias
	on(type, listener) {
		this.addEventListener(type, listener);
	}

	off(type, listener) {
		this.removeEventListener(type, listener);
	}

	trigger(event) {
		this.dispatchEvent(event);
	}
}
