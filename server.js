const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const MLAPI = 'https://api.mercadolibre.com';

const getCurrencyInfo = currencyId => (
	axios
		.get(`${MLAPI}/currencies/${currencyId}`)
		.then( currencyRes => currencyRes.data )
		.catch( err => console.log(err) )
);

const getItemDescription = itemId => (
	axios
		.get( `${MLAPI}/items/${itemId}/description` )
		.then( descriptionRes => descriptionRes.data )
		.catch( err => console.log(err) )
);

const getItem = itemId => (
	axios.get( `${MLAPI}/items/${itemId}` )
		.then( ({data}) => (
			getCurrencyInfo(data.currency_id)
				.then( currencyRes => ({ ...data, currency: currencyRes }) )
		))
		.then( item => (
			getItemDescription(item.id)
				.then( descriptionRes => ({ ...item, description: descriptionRes }) )
		))
		.then( item => {
			const itemFormat = {
				author: {
					name: '',
					lastname: ''
				},
				item: {
					id: item.id,
					title: item.title,
					price: {
						currency: item.currency.id,
						amount: item.base_price,
						decimals: item.currency.decimal_places
					},
					picture: item.pictures[0],
					condition: item.condition,
					free_shipping: item.shipping.free_shipping,
					sold_quantity: item.sold_quantity,
					description: item.description.plain_text,
				}
			};

			return itemFormat;
		})
		.catch( err => console.log(err) )
);

const getSearchCategories = query => (
	axios
		.get(`${MLAPI}/sites/MLA/search?limit=4&q=${query}` )
		.then( ({data}) => {
			return data.filters.map(el => {
				if (el.id === 'category') {
					return el.values[0].path_from_root.map(category => category.name);
				};
			}).flat(1);
		})
		.catch( err => console.log(err) )
);

app.get('/api/items', (req, res) => {
	axios.get( `${MLAPI}/sites/MLA/search?limit=4&q=${req.query.q}` )
		.then( ({ data }) => (
			getSearchCategories(req.query.q)
				.then( categoriesRes => ({...data, categories: categoriesRes}) )
		))
		.then( data => {
			const searchItems = data.results.map( item => getItem(item.id).then( r => r.item ) );
			return { ...data, items: Promise.all(searchItems) };
		})
		.then( data => {
			data.items.then(itemsList => {
				const resultsFormat = {
					author: {
						name: '',
						lastname: ''
					},
					categories: data.categories,
					items: itemsList
				};
				res.send(resultsFormat);
			});
		})
		.catch( err => console.log(err) );
});

app.get('/api/items/:id', (req, res) => {
	getItem(req.params.id).then( item => res.send(item) );
});

app.listen(port, () => console.log(`Listening on port ${port}`));
