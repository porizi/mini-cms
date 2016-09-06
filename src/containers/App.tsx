import * as React from 'react';
import {Link} from 'react-router';
import {CMSNavBar} from '../lib/cms/components/CMSNavBar';
import {isUserAuthorized} from '../utils/auth';
import '../../node_modules/bootstrap/dist/css/bootstrap.css';
import '../styles.css';

export class App extends React.Component<any,any> {
  public render(): JSX.Element {
    return (
      <div className="container">
        <CMSNavBar isUserAuthorized={isUserAuthorized()}/>
        <Link to="/">Home</Link> | <Link to="/event">Event</Link>
        {this.props.children}
      </div>
    );
  }
}
