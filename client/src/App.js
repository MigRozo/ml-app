import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
	const getResponse = async api_url => {
		const response = await fetch(api_url);
		const body = await response.json();

		if (response.status !== 200) throw Error(body.message);

		return body;
	};

	const [categories, setCategories] = useState([]);

	useEffect(() => {
		getResponse('/api/items?q=mouse').then( result => {
			setCategories(result.categories);
		}, err => {
			console.error('Fetch Error: ', err);
		});
	}, []);

	return (
		<div className="App">
			<h2>Query</h2>
			<p>{ categories.join() }</p>
		</div>
	);
}

export default App;
