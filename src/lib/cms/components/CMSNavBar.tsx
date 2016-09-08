import * as React from 'react';
import {ICmsContext} from '../models';
import {publishDraftCmsData} from '../client';

export class CMSNavBar extends React.Component<any, any> {

  context: ICmsContext;

  static contextTypes: React.ValidationMap<any> = {
    isInEditMode: React.PropTypes.bool.isRequired
  }

  public constructor(props?: any, context?: any) {
    super(props, context);
    this.handlePublishChangesClick = this.handlePublishChangesClick.bind(this);
  }

  private handlePublishChangesClick(): void {
    publishDraftCmsData()
      .then(() => { alert('Changes have been successfully published') })
      .catch(() => { alert('Error while publishing changes') })
  }

  private renderCMSNavBar(): JSX.Element {
    if(this.context.isInEditMode) {
      return(
        <nav className="navbar navbar-default">
          <div className="container-fluid">
            <ul className="nav navbar-nav navbar-right">
              <li>
                 <button onClick={this.handlePublishChangesClick}
                         className="btn btn-success navbar-btn">
                      Publish changes
                 </button>
              </li>
            </ul>
          </div>
        </nav>
      );
    }
  }

  public render(): JSX.Element {
    return (
      <div>
        {this.renderCMSNavBar()}
      </div>
    );
  }
}
