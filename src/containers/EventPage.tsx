import * as React from 'react';
import {IChangeEvent} from 'react-jsonschema-form';
import {CMSEditableForm} from '../lib/cms/components/CMSEditableForm';
import {ICmsContext} from '../models';
import {isUserAuthorized} from '../utils/auth';
import {addComponentCSS} from '../utils/css_styler';

addComponentCSS({
  //language=CSS
  default: `
    .pr-event-page {
      min-height: 200px;
    }
    .pr-event-page__content {
      position: relative;
      display: inline-block;
      margin-top: 30px;
    }
  `
});

export class EventPage extends React.Component<any, any> {

  context: ICmsContext;

  static contextTypes: React.ValidationMap<ICmsContext> = {
    cmsData: React.PropTypes.object.isRequired
  }

  private getSchema(): any {
    return {
      title: 'Event Form',
      type: 'object',
      required: ['title', 'location'],
      properties: {
        title: {type: 'string', title: 'Title'},
        location: {type: 'string', title: 'Location'}
      }
    };
  }

  public render(): JSX.Element {
    const {cmsData} = this.context;
    return (
      <div className="pr-event-page">
          <span className="pr-event-page__content">
            <CMSEditableForm isUserAuthorized={isUserAuthorized()}
                          schema={this.getSchema()}
                          formData={cmsData.event}
                          path={['event']}/>
            <p>Title: {cmsData.event.title}</p>
            <p>Location: {cmsData.event.location}</p>
          </span>
      </div>
    );
  }
}
