import React from 'react';
import {Router, browserHistory} from 'react-router'
import Auth from './../modules/Auth';

const routes = {
	path: '/',
	getComponent(nextState, cb) {
		if (Auth.isUserAuthenticated()) {
			require.ensure([], require => { //code splitting
				cb(null, require('../components/Base/AuthorizedBase').default); //callback signature: (err, component)
			});
		} else {
			require.ensure([], require => {
				cb(null, require('../components/Base/UnauthorizedBase').default);
			});
		}
	},
	onEnter(nextState, replace) {
		let pathname = nextState.location.pathname;
		if (!Auth.isUserAuthenticated() && pathname !== '/login') {
			replace('/login');
		} else if (pathname !== '/') {
			replace('/');
		}
	},
	indexRoute: {
		getComponent(nextState, cb) {
			require.ensure([], require => {
				cb(null, require('../components/Dashboard/Dashboard').default);
			});
		}
	},
	childRoutes: [
		{
			path: 'login'
		},
		{
			path: 'data-sources',
			getComponent(nextState, cb) {
				require.ensure([], require => {
					cb(null, require('../components/DataSource/DataSourceGrid').default);
				});
			}
		},
		{
			path: 'e404',
			getComponent(nextState, cb) {
				require.ensure([], require => {
					cb(null, require('../components/Error/NotFound').default);
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
