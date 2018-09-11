# Finite-State-Machine
I'll be VERY surprised if any of this works in Internet Explorer - it's not designed to. Please don't open any IE related issues :)
## Usage
```JS
new FSM( initial_state:string , states:object);
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

### Example

```JS
var test = new FSM('idle', {
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

test.on('state-change', (e)=>console.log(e.detail));
test.run();
```
