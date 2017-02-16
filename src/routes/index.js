import React from 'react';
import {Router, browserHistory} from 'react-router'
import Auth from 'services/Authenticator';

const routes = {
	path: '/',
	getComponent(nextState, cb) {
		if (Auth.isUserAuthenticated()) {
			require.ensure([], require => { //code splitting
				cb(null, require('components/Base/AuthorizedBase').default); //callback signature: (err, component)
			});
		} else {
			if (nextState.location.pathname !== '/login') {
				browserHistory.push('/login');
			}
			require.ensure([], require => {
				cb(null, require('components/Base/UnauthorizedBase').default);
			});
		}
	},
	onEnter(nextState, replace) {
		let pathname = nextState.location.pathname;
		if (Auth.isUserAuthenticated() && pathname === '/login') {
			replace('/');
		}
	},
	indexRoute: {
		getComponent(nextState, cb) {
			require.ensure([], require => {
				cb(null, require('scenes/UserConsole/scenes/WeatherStations/AllWeatherStationsContainer').default);
			});
		}
	},
	childRoutes: [
		{
			path: 'login'
		},
		...require('scenes/UserConsole/routes').default,
		{
			path: 'e404',
			getComponent(nextState, cb) {
				require.ensure([], require => {
					cb(null, require('scenes/Error/NotFound').default);
				});
			}
		},
		{
			path: '*',
			onEnter(nextState, replace) {
				replace('/e404');
			},
		}
	],
};

export default (
	<Router history={browserHistory} routes={routes}/>
);
