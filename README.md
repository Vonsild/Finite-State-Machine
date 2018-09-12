# Finite State Machine
I'll be VERY surprised if any of this works in Internet Explorer - it's not designed to. Please don't open any IE related issues :)

A "state" is a semi-stable state of the system, that doesn't change, unless something acts on it.

A "transition" is the action, that moves the system from one state to another.

## Usage
```JS
new FSM( initial_state:string , states:object );
```
States are defined as
```JS
{
  'state 1' : {
    'transition_to_state_2' : FSM.transition('state 2', ()=>return true),
    'transition_to_state_3' : FSM.transition('state 3', ()=>return true)
  },
  'state 2' : {
    'transition_to_state_3' : FSM.transition('state 3', ()=>return true)
  },
  'state 3' : {}
}
```

Transitions are atomic - that is, they either move the FSM to a new state (by returning a truthy value) or not (returning a falsey value, or triggering an error). A transition is synchronous. If you want to do asynchronous stuff before "finalising" the transition to the new state, for example fetching remote data, then display it, you should use a "fetching" or "waiting for data" state, from which you can transition once your data is ready;

![Diagram](doc/diagram_1.png)

### Example

```JS
var runner = new FSM('idle', {
	'idle' : {
		'run' : FSM.transition('running', function() {
			console.log("I'll take a run"); 
			let fsm = this; 
			setTimeout(function(){fsm.stop('no', 'more')},1000); 
			return "sprinting";
		})
	},
	'running' : {
		'stop' : FSM.transition('idle', function(arg1, arg2) {
			console.log("Don't wanna run", arg1, arg2); 
			return true;
		})
	}
})

runner.on('state-change', (e)=>console.log(e.detail));
runner.run();
```
