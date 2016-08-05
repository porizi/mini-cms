import * as React from 'react';
import Form from 'react-jsonschema-form';
import {IChangeEvent} from 'react-jsonschema-form';
import {addComponentCSS} from '../../utils/css_styler';

addComponentCSS({
  //language=CSS
  default: `
    .pr-editable-form__form-wrapper {
      position: fixed;
      top: 0px;
      left: 0px;
      right: 0px;
      bottom: 0px;
      z-index: 9999;
      background-color: rgba(0, 0, 0, 0.80);
    }
    .pr-editable-form__form {
      max-width: 420px;
      margin: 20px auto 0px auto;
      background: white;
      padding: 10px;
      border-radius: 4px;
    }
    .pr-editable-form__form form {
      max-width: 320px;
    }
    .pr-editable-form__form .array-item-add {
      width: auto;
    }
    .pr-editable-form__toggle-btn {
      text-transform: uppercase;
      background: #337ab7;
      width: 100px;
      height: 30px;
      display: block;
      line-height: 30px;
      color: white;
      padding: 0px;
      margin: 0px 0px 10px;
    }
    `
});


interface IEditableFormProps {
  isUserAuthorized: boolean,
  schema: any,
  formData: any,
  onSubmit: (data: IChangeEvent) => void
}

interface IEditableFormState {
  showEditableForm: boolean
}

export class EditableForm extends React.Component<IEditableFormProps, IEditableFormState> {

  public constructor(props: IEditableFormProps, context?: any) {
    super(props, context);
    this.state = {
      showEditableForm: false
    };
    this.toggleShowEditableForm = this.toggleShowEditableForm.bind(this);
  }

  private renderChildrenWithProps(): JSX.Element[] {
    return React.Children.map(this.props.children, (child: JSX.Element) =>
      React.cloneElement(child, {'values': this.props.formData})
    );
  }

  private renderEditableForm(): JSX.Element {
    const {isUserAuthorized, schema, formData, onSubmit} = this.props;
    if(isUserAuthorized && this.state.showEditableForm) {
      return(
        <div className="pr-editable-form__form-wrapper">
          <div className="pr-editable-form__form">
            <button className="btn pr-editable-form__toggle-btn" onClick={this.toggleShowEditableForm}>Close</button>
            <Form schema={schema}
                  formData={formData}
                  onSubmit={(data: IChangeEvent) => {
                    this.toggleShowEditableForm();
                    onSubmit(data);
                  }}/>
          </div>
        </div>
      );
    }
  }

  private toggleShowEditableForm(): void {
    this.setState({ showEditableForm: !this.state.showEditableForm });
  }

  public render(): JSX.Element {
    return (
      <div>
        <button className="btn pr-editable-form__toggle-btn" onClick={this.toggleShowEditableForm}>Edit</button>
        {this.renderEditableForm()}
        {this.renderChildrenWithProps()}
      </div>
    );
  }
}

