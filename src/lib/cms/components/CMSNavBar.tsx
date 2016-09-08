import * as React from 'react';
import {ICmsContext} from '../models';
import {publishDraftCmsData} from '../client';

export class CMSNavBar extends React.Component<any, any> {

  context: ICmsContext;

  static contextTypes: React.ValidationMap<ICmsContext> = {
    isUserAuthorized: React.PropTypes.bool.isRequired,
    isInEditMode: React.PropTypes.bool.isRequired,
    isInViewMode: React.PropTypes.bool.isRequired,
    onPublishChanges: React.PropTypes.func.isRequired,
    onTogglePreviewMode : React.PropTypes.func.isRequired
  }

  private renderCMSNavBar(): JSX.Element {
    if(this.context.isUserAuthorized) {
      return(
        <nav className="navbar navbar-default">
          <div className="container-fluid">
            <ul className="nav navbar-nav navbar-right">
              <li>{this.renderPreviewModeButton()}</li>
              <li>{this.renderEditModelButton()}</li>
              <li>
                 <button onClick={this.context.onPublishChanges}
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

  private renderPreviewModeButton(): JSX.Element {
    if(this.context.isInEditMode) {
      return(
        <button onClick={() => { this.context.onTogglePreviewMode(false) }}
               className="btn btn-primary navbar-btn">
            Preview mode
        </button>
      )
    }
  }

  private renderEditModelButton(): JSX.Element {
    if(this.context.isInViewMode) {
      return(
        <button onClick={() => { this.context.onTogglePreviewMode(true) }}
               className="btn btn-primary navbar-btn">
            Edit mode
        </button>
      )
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
