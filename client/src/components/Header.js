import React, {useState, useEffect} from 'react';
import { Link, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import './Header.scss';


const Header = (props) => {
	const location = useLocation();
	const [q, setQ] = useState('');

	useEffect(() => {
		const params = queryString.parse(location.search);
		setQ(params.search);
	}, [location.search])

	return (
		<header className="header">
			<div className="container">
				<div className="fx ac">
					<Link className="logo" to="/">
						<img src="/img/logo.png" alt="ML logo" />
					</Link>
					<div className="searchBar">
						<form action="/items" method="GET">
							<div className="searchBar_field fx">
								<input type="text" name="search" placeholder="Nunca dejes de buscar" defaultValue={q} />
								<button type="submit">Buscar</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</header>
	)
};

export default Header;