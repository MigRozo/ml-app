import React, {Fragment, useState, useEffect} from 'react';
import { Link } from "react-router-dom";
import queryString from 'query-string';
import './List.scss';

const Items = ({ query }) => {
	const getResponse = async api_url => {
		const response = await fetch(api_url);
		const body = await response.json();

		if (response.status !== 200) throw Error(body.message);

		return body;
	};

	const [resultsError, setResultsError] = useState(null);
	const [resultsLoaded, setResultsLoaded] = useState(false);
	const [items, setItems] = useState([]);
	const [categories, setCategories] = useState([]);

	useEffect(() => {
		getResponse(`/api/items?q=${query}`).then( resp => {
			setResultsLoaded(true);
			setItems(resp.items);
			setCategories(resp.categories);
		}, err => {
			setResultsLoaded(true);
			setResultsError(err);
			console.error('Fetch Error: ', err);
		});
	}, [query]);

	if (resultsError) {
		return <p>{resultsError.message}</p>
	} else if (!resultsLoaded) {
		return <p>loading...</p>
	} else {
		const currencyFormat = (amount = 0) => {
			const formater = new Intl.NumberFormat('es-AR', {
				style: 'currency',
				currency: 'ARS',
				currencyDisplay: 'symbol',
				minimumFractionDigits: 2
			});
			return formater.format(amount);
		};
		return (
			<Fragment>
				<div className="breadcrumb">
					{
						categories.map((cat, i) => <span key={i}>{cat}</span> )
					}
				</div>
				<ul className="results_list">
					{
						items.map(item => (
							<li className={`results_item ${item.free_shipping ? 'freeship' : ''}`} key={item.id}>
								<Link className={`results_link fx ac`} to={`/items/${item.id}`}>
									<img className="results_pic" src={item.picture} alt={item.title} loading="lazy" />
									<div className="results_desc">
										<span className="results_price">{currencyFormat(item.price.amount)}</span>
										<h2 className="results_title">{item.title}</h2>
									</div>
									<span className="results_aside">{item.condition}</span>
								</Link>
							</li>
						))
					}
				</ul>
			</Fragment>
		)
	}
};

const List = ({ location }) => {
	const params = queryString.parse(location.search);
	return (
		<section className="results">
			<div className="container">
				<Items query={params.search} />
			</div>
		</section>
	)
};

export default List;