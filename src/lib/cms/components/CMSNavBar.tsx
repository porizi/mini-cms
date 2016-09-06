import * as React from 'react';
import {publishDraftCmsData} from '../client';

interface ICMSNavBarProps {
  isUserAuthorized: boolean  // Determine if 'CMSNavBar' should be visible if current user
                             // is authorized to do so
}

export class CMSNavBar extends React.Component<ICMSNavBarProps, any> {

  public constructor(props: ICMSNavBarProps, context?: any) {
    super(props, context);
    this.handlePublishChangesClick = this.handlePublishChangesClick.bind(this);
  }

  private handlePublishChangesClick(): void {
    publishDraftCmsData()
      .then(() => { alert('Changes have been successfully published') })
      .catch(() => { alert('Error while publishing changes') })
  }

  private renderCMSNavBar(): JSX.Element {
    if(this.props.isUserAuthorized) {
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
