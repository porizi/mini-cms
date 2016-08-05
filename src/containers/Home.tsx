import * as React from 'react';
import {EditableForm} from '../components/shared/EditableForm';
import {Tasks} from '../components/home/Tasks';
import {IChangeEvent} from 'react-jsonschema-form';

export class Home extends React.Component<any,any> {

  public constructor(props: any, context?: any) {
    super(props, context);
    // This form data should actually come from a file instead
    this.state = {
      formData: ['1', '2', '3']
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  private getSchema() {
    return {
      'type': 'array',
      'items': {
        'type': 'string'
      }
    };
  }

  // This method should be able to locate where the data for this component
  // is in the content file/configuration file (i.e. config.home.tasks).
  private getFormData() {
    return this.state.formData;
  }

  // Assume some service executes the authentication and authorization
  // logic, return true for now
  private isUserAuthorized(): boolean {
    return true;
  }

  // This should set formData values in the content file/configuration file.
  // Use state for testing purposes for now.
  public handleSubmit(data: IChangeEvent): void {
    this.setState({ formData: data.formData });
  }

  public render(): JSX.Element {
    return (
      <EditableForm isUserAuthorized={this.isUserAuthorized()}
                    schema={this.getSchema()}
                    formData={this.getFormData()}
                    onSubmit={this.handleSubmit}>
        <Tasks/>
      </EditableForm>
    );
  }
}
