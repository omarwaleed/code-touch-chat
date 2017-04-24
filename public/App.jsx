const React = require('react');
const ReactDOM = require('react-dom');
const axios = require('axios');
const socket = require('socket.io');

class App extends React.Component {
	constructor(){
		super();
	    var state = {
	        everyone: [],
	        selected: ''
	    };
	    var socket = io();
	}

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
