import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from './components/Header';
import List from './components/List';
import Item from './components/Item';
import './App.scss';

function App() {
	return (
		<div className="App">
			<Router>
				<Header query="balon" />
				<Switch>
					<Route exact path="/items" component={List} />
					<Route exact path="/items/:id" component={Item} />
				</Switch>
			</Router>
		</div>
	);
}

export default App;
