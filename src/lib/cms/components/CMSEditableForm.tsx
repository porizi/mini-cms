import * as React from 'react';
import Form from 'react-jsonschema-form';
import {IChangeEvent} from 'react-jsonschema-form';
import {ICmsContext} from '../models';
import {addComponentCSS} from '../../../utils/css_styler';

addComponentCSS({
  //language=CSS
  default: `
    .pr-cms-editable-form__wrapper,
    .pr-cms-editable-form__bg {
      position: fixed;
      top: 0px;
      left: 0px;
      right: 0px;
      bottom: 0px;
    }
    .pr-cms-editable-form__bg {
      z-index: 9999;
      background-color: rgba(0, 0, 0, 0.80);
    }
    .pr-cms-editable-form__form {
      position: relative;
      z-index: 9999;
      max-width: 420px;
      margin: 20px auto 0px auto;
      background: white;
      padding: 10px;
      border-radius: 4px;
    }
    .pr-cms-editable-form__form form {
      max-width: 320px;
    }
    .pr-cms-editable-form__edit-btn-wrapper {
      position: absolute;
      top: -25px;
      right: 0px;
    }
    .pr-cms-editable-form__edit-btn {
      padding: 4px 8px;
      font-size: 10px;
    }
  `
});

interface ICMSEditableFormProps {
  schema   : any // Schema to use for the 'react-jsonschema-form' form
  formData?: any // Initial data to use for the form (if any)
  path     : string[] // Path in the cmsData object where the current data should be updated at
}

interface ICMSEditableFormState {
  showCMSEditableForm: boolean // Determines if the form modal should be shown or not
}

export class CMSEditableForm extends React.Component<ICMSEditableFormProps, ICMSEditableFormState> {

  context: ICmsContext;

  static contextTypes: React.ValidationMap<ICmsContext> = {
    onCmsDataUpdate: React.PropTypes.func.isRequired,
    isInEditMode: React.PropTypes.bool.isRequired
  }

  public constructor(props: ICMSEditableFormProps, context?: any) {
    super(props, context);
    this.state = {
      showCMSEditableForm: false
    };
    this.toggleShowCMSEditableForm = this.toggleShowCMSEditableForm.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  private handleSubmit(data: IChangeEvent): void {
    if(this.context.isInEditMode) {
      this.context.onCmsDataUpdate(data.formData, this.props.path);
      this.toggleShowCMSEditableForm();
    }
  }

  private renderEditButton(): JSX.Element {
    if(this.context.isInEditMode) {
      return(
        <div className="pr-cms-editable-form__edit-btn-wrapper">
          <button className="btn pr-cms-editable-form__edit-btn" onClick={this.toggleShowCMSEditableForm}>
            <i className="fa fa-pencil"/>
          </button>
        </div>
      );
    }
  }

  private renderCMSEditableForm(): JSX.Element {
    if(this.context.isInEditMode && this.state.showCMSEditableForm) {
      return(
        <div className="pr-cms-editable-form__wrapper">
          <div className="pr-cms-editable-form__bg"
               onClick={() => { this.toggleShowCMSEditableForm() }}/>
          <div className="pr-cms-editable-form__form">
            <button onClick={this.toggleShowCMSEditableForm} className="btn">
              <i className="fa fa-times"/>
            </button>
            <Form schema={this.props.schema}
                  formData={this.props.formData}
                  onSubmit={this.handleSubmit}/>
          </div>
        </div>
      );
    }
  }

  private toggleShowCMSEditableForm(): void {
    this.setState({ showCMSEditableForm: !this.state.showCMSEditableForm });
  }

  public render(): JSX.Element {
    return (
      <span>
        {this.renderEditButton()}
        {this.renderCMSEditableForm()}
      </span>
    );
  }
}

