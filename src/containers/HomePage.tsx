import * as React from 'react';
import {IChangeEvent} from 'react-jsonschema-form';
import {CMSEditableForm} from '../lib/cms/components/CMSEditableForm';
import {ICmsContext} from '../models';
import {isUserAuthorized} from '../utils/auth';
import {addComponentCSS} from '../utils/css_styler';

addComponentCSS({
  //language=CSS
  default: `
    .pr-home-page {
      min-height: 200px;
    }
    .pr-home-page__content {
      position: relative;
      display: inline-block;
      margin-top: 30px;
    }
  `
});

export class HomePage extends React.Component<any, any> {

  context: ICmsContext;

  static contextTypes: React.ValidationMap<any> = {
    cmsData: React.PropTypes.object.isRequired
  }

  private getSchema(): any {
    return {
      title: 'Form example',
      description: 'A simple form example.',
      type: 'object',
      required: ['bio'],
      properties: {
        bio: {type: 'string', title: 'Bio'}
      }
    };
  }

  public render(): JSX.Element {
    const {cmsData} = this.context;
    return (
      <div className="pr-home-page">
          <span className="pr-home-page__content">
            <CMSEditableForm isUserAuthorized={isUserAuthorized()}
                          schema={this.getSchema()}
                          formData={cmsData.home}
                          path={['home']}/>
            <p>Bio: {cmsData.home.bio}</p>
          </span>
      </div>
    );
  }
}
