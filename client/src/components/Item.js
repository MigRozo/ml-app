import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Item.scss';

const ItemView = () => {
	let { id } = useParams();

	const getResponse = async api_url => {
		const response = await fetch(api_url);
		const body = await response.json();

		if (response.status !== 200) throw Error(body.message);

		return body;
	};

	const [resultError, setResultError] = useState(null);
	const [resultLoaded, setResultLoaded] = useState(false);
	const [result, setResult] = useState({price:{}});

	useEffect(() => {
		getResponse(`/api/items/${id}`).then( resp => {
			setResultLoaded(true);
			setResult(resp.item);
		}, err => {
			setResultLoaded(true);
			setResultError(err);
			console.error('Fetch Error: ', err);
		});
	}, [id]);

	if (resultError) {
		return <p>{resultError.message}</p>
	} else if (!resultLoaded) {
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
			<article className="detail_item">
				<div className="detail_top fx jb">
					<img className="detail_pic" src={result.picture} alt={result.title} loading="lazy" />
					<div className="detail_info">
						<span className="detail_dets">{result.condition} - {result.sold_quantity} Vendidos</span>
						<h1 className="detail_title">{result.title}</h1>
						<span className="detail_price">{currencyFormat(result.price.amount)}</span>
						<a href="#" className="detail_btn">Comprar</a>
					</div>
				</div>
				<div className="detail_bottom">
					<h2>Descripción del producto</h2>
					<p>{result.description}</p>
				</div>
			</article>
		)
	}
};

const Item = () => {
	return (
		<section className="detail">
			<div className="container">
				<ItemView />
			</div>
		</section>
	)
};

export default Item;