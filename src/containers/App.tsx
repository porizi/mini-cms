import * as React from 'react';
import {Link} from 'react-router';
import {CMSNavBar} from '../lib/cms/components/CMSNavBar';
import {IAppContext} from '../models';
import '../../node_modules/bootstrap/dist/css/bootstrap.css';
import '../styles.css';

export class App extends React.Component<any,any> {

  context: IAppContext;

  static contextTypes: React.ValidationMap<IAppContext> = {
    cmsData: React.PropTypes.object.isRequired
  }

  // Encapsulate CMS context as props for all children
  // in order to avoid redundancy
  private renderChildrenWithContextAsProps(): JSX.Element[] {
    return React.Children.map(this.props.children, (child: JSX.Element) =>
      React.cloneElement(child, {
        cmsData: this.context.cmsData
      })
    );
  }

  public render(): JSX.Element {
    return (
      <div className="container">
        <CMSNavBar/>
        <Link to="/">Home</Link> | <Link to="/event">Event</Link>
        {this.renderChildrenWithContextAsProps()}
      </div>
    );
  }
}
