import * as React from 'react';
import * as Immutable from 'immutable';
import {IRequestResponse, ICmsDataDbModel} from '../models';
import {updateDraftCmsData} from '../client';

interface ICMSProviderProps {
  cmsData     : ICmsDataDbModel  // CMS data
  isInEditMode: boolean          // True if application is being rendered in edit mode
}

interface ICMSProviderState {
  cmsData: ICmsDataDbModel // CMS data
}

export class CMSProvider extends React.Component<ICMSProviderProps, ICMSProviderState> {

  static childContextTypes = {
    cmsData        : React.PropTypes.object.isRequired,
    onCmsDataUpdate: React.PropTypes.func.isRequired,
    isInEditMode   : React.PropTypes.bool.isRequired
  }

  public constructor(props: ICMSProviderProps, context?: any) {
    super(props, context);
    this.state = {
      cmsData: this.props.cmsData
    }
    this.handleCmsDataUpdate = this.handleCmsDataUpdate.bind(this);
  }

  public getChildContext(): any {
    return {
      cmsData        : this.state.cmsData,
      onCmsDataUpdate: this.handleCmsDataUpdate,
      isInEditMode   : this.props.isInEditMode
    };
  }

  /**
   * Send request to server to update the CMS data
   * @param data - CMS data that has been updated
   * @param path - Path where the data to be updated should be saved
   */
  public handleCmsDataUpdate(data: any, path: string[]): void {
    updateDraftCmsData(data, path)
      .then((result: IRequestResponse) => {
        this.setState(
          Immutable.fromJS(this.state)
            .setIn(['cmsData'], result.data)
            .toJS()
        );
      })
      .catch((data: IRequestResponse) => { alert(data.error) });
  }

  public render(): JSX.Element {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}
