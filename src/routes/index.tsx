import * as React from 'react';
import {Route, IndexRoute} from 'react-router';
import {App} from '../containers/App';
import {HomePage} from '../containers/HomePage';
import {EventPage} from '../containers/EventPage';

const routes = (
  <Route component={App}>
    <Route path="/" component={HomePage}/>
    <Route path="/event" component={EventPage}/>
  </Route>
);

export default routes;
