import * as React from 'react';
import {ICmsContext} from '../models';
import {publishDraftCmsData} from '../client';

export class CMSNavBar extends React.Component<any, any> {

  context: ICmsContext;

  static contextTypes: React.ValidationMap<ICmsContext> = {
    isUserAuthorized   : React.PropTypes.bool.isRequired,
    isInEditMode       : React.PropTypes.bool.isRequired,
    isInViewMode       : React.PropTypes.bool.isRequired,
    onPublishChanges   : React.PropTypes.func.isRequired,
    onTogglePreviewMode: React.PropTypes.func.isRequired
  }

  private renderCMSNavBar(): JSX.Element {
    const {isUserAuthorized, onPublishChanges} = this.context;
    if(isUserAuthorized) {
      return(
        <nav className="navbar navbar-default">
          <div className="container-fluid">
            <ul className="nav navbar-nav navbar-right">
              <li>{this.renderPreviewModeButton()}</li>
              <li>{this.renderEditModelButton()}</li>
              <li>
                 <button onClick={onPublishChanges}
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
    const {isInEditMode, onTogglePreviewMode} = this.context;
    if(isInEditMode) {
      return(
        <button onClick={() => { onTogglePreviewMode(false) }}
               className="btn btn-primary navbar-btn">
            Preview mode
        </button>
      )
    }
  }

  private renderEditModelButton(): JSX.Element {
    const {isInViewMode, onTogglePreviewMode} = this.context;
    if(isInViewMode) {
      return(
        <button onClick={() => { onTogglePreviewMode(true) }}
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
