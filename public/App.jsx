const React = require('react');
const ReactDOM = require('react-dom');
const axios = require('axios');
const socket = require('socket.io');

class App extends React.Component {

	let socket = io();

	constructor(){
		super();
	    let state = {
	        everyone: [],
	        selected: ''
	    };
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(event){
		event.preventDefault();
		let m = document.getElementById('m').value;
		console.log('submit');
		if(this.state.selected === ""){
			this.state.everyone.push({sender: "you", msg: m});
			socket.emit('chat message', {message: m, for: $('#username')[0].value});
			document.getElementById('messages').innerHTML += ('<li><h3>You: '+m+'</h3></li>');
		} else {
			console.log('define',this.state[this.state.selected], this.state.selected);
			if(this.state[this.state.selected] === undefined){
				this.setState({this.state[this.state.selected]: [{sender: "you", msg: m}]})
			} else {
				this.setState({this.state[this.state.selected]: ([...this.state[this.state.selected]].push({sender: "you", msg:m}))});
			}
			document.getElementById('messages').innerHTML += ('<li><h3>PRIVATE You: '+m+'</h3></li>');
			// this.state[this.state.selected] = [...this.state[this.state.selected]].push({sender: "you", msg:m}) || [{sender: "you", msg: m}];
			socket.emit('chat message', {message: m, for: $('#username')[0].value, to: this.state.selected})
		}
		// log('here');
		m.val('');
		// return false;
	}

	socket.on('chat message', function(msg){
		// console.log('got message', msg)
		var sender = (msg.for || 'anon')
		var isPrivate = (msg.to !== undefined)? "PRIVATE ": "";
		$('#messages').append($('<li>').text(isPrivate + sender + ": "+msg.message));
		console.log(state.everyone);
		let array = [...this.state.everyone, {sender: sender, msg: msg.message}]
		this.setState({everyone: array});
	});
	socket.on('typing', function(content){
		console.log('typing received',content.user);
		document.getElementById('typing').innerHTML = (content.user+' is typing');
		setTimeout(function(){
			document.getElementById('typing').innerHTML = '';
			// console.log('hidden');
		}, 5000)
	});
	socket.on('user connection', function(msg){
		document.getElementById('connection').innerHTML += ('<br />'+msg);
		setTimeout(()=>{
			document.getElementById('connection').innerHTML = '';
		}, 5000);
	});
	socket.on('users', function(data){
		let out = '';
		for (var i = 0; i < data.length; i++) {
			out += `<li onclick="setSelected('${data[i]}')">`+data[i]+'</li>'
		}
		document.getElementById('connectedusers').innerHTML = out;
		// console.log('sockets are ', data);
	});

	render(){
		return (
			<div>
				<div style="display: flex; flex: 1; width: 100%; space-between: center;">
			        <div style="flex: 7;">
			            <span style="font-size: 30px;">Messages</span>
			            <ul id="messages"></ul>
			            <h1 id="typing"></h1>
			            <h1 id="connection"></h1>
			        </div>
			        <div style="flex: 3; align-content: center;">
			            <span style="font-size: 30px;" onclick="clearSelected()">Users</span>
			            <ul id="connectedusers" style="margin-top: 20px;">
			            </ul>
			        </div>
			    </div>
			    <form action="" id="form">
			        <input type="text" id="username" value="" placeholder="Username"/><input id="m" autocomplete="off" onchange="emitTyping()" /><button>Send</button>
			    </form>
			</div>
		)
	}
}

ReactDOM.render(<App />, document.getElementById('app'));
