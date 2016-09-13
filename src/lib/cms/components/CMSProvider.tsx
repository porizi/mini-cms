import * as React from 'react';
import * as Immutable from 'immutable';
import {IRequestResponse, ICmsDataDbModel} from '../models';
import {updateDraftCmsData, publishDraftCmsData} from '../client';

interface ICMSProviderProps {
  cmsData         : ICmsDataDbModel  // CMS data
  isUserAuthorized: boolean          // True if current user is authorized to edit CMS data
}

interface ICMSProviderState {
  cmsData     : ICmsDataDbModel // CMS data
  isInEditMode: boolean         // True if CMS is in edit mode
}

export class CMSProvider extends React.Component<ICMSProviderProps, ICMSProviderState> {

  static childContextTypes = {
    cmsData             : React.PropTypes.object.isRequired,
    isInEditMode        : React.PropTypes.bool.isRequired,
    isInViewMode        : React.PropTypes.bool.isRequired,
    isUserAuthorized    : React.PropTypes.bool.isRequired,
    onCmsDataUpdate     : React.PropTypes.func.isRequired,
    onPublishChanges    : React.PropTypes.func.isRequired,
    onTogglePreviewMode : React.PropTypes.func.isRequired
  };

  public constructor(props: ICMSProviderProps, context?: any) {
    super(props, context);
    this.state = {
      cmsData     : this.props.cmsData,
      isInEditMode: this.props.isUserAuthorized // Set CMS initially in edit mode if user is authorized
    };
    this.handleCmsDataUpdate = this.handleCmsDataUpdate.bind(this);
    this.handleTogglePreviewMode = this.handleTogglePreviewMode.bind(this);
    this.handlePublishChanges = this.handlePublishChanges.bind(this);
  }

  public getChildContext(): any {
    return {
      cmsData             : this.state.cmsData,
      isInEditMode        : this.state.isInEditMode,
      isInViewMode        : !this.state.isInEditMode,
      isUserAuthorized    : this.props.isUserAuthorized,
      onCmsDataUpdate     : this.handleCmsDataUpdate,
      onPublishChanges    : this.handlePublishChanges,
      onTogglePreviewMode : this.handleTogglePreviewMode
    };
  }

  /**
   * Send request to server to update the CMS data
   * @param data - CMS data that has been updated
   * @param path - Path where the data to be updated should be saved
   */
  public handleCmsDataUpdate(data: any, path: string[]): void {
    if(this.props.isUserAuthorized) {
      updateDraftCmsData(data, path)
        .then((result: IRequestResponse) => {
          this.setState(
            Immutable.fromJS(this.state)
              .setIn(['cmsData'], result.data)
              .toJS()
          );
        })
        .catch((data: IRequestResponse) => { alert(data.error) });
    } else {
      this.showUnauthorizedAlert();
    }
  }

  public handlePublishChanges(): void {
    if(this.props.isUserAuthorized) {
      publishDraftCmsData()
        .then(() => { alert('Changes have been successfully published') })
        .catch(() => { alert('Error while publishing changes') })
    } else {
      this.showUnauthorizedAlert();
    }
  }

  /**
   * Toggle CMS data preview
   * @param shouldShowEditMode - True if should show CMS in edit mode
   */
  public handleTogglePreviewMode(shouldShowEditMode: boolean): void {
    if(this.props.isUserAuthorized) {
      this.setState(
        Immutable.fromJS(this.state)
          .setIn(['isInEditMode'], shouldShowEditMode)
          .toJS()
      );
    } else {
      this.showUnauthorizedAlert();
    }
  }

  private showUnauthorizedAlert(): void {
    alert('Current user is unauthorized to perform this action');
  }

  public render(): JSX.Element {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}
