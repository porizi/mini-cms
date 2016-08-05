import * as React from 'react';

interface ITasksProps {
  values?: string[]
}

export class Tasks extends React.Component<ITasksProps, any> {

  private renderValues(values: string[]): JSX.Element[] {
    return values.map((value: string, index: number) => {
      return (
        <li className="pr-task" key={index}>{value}</li>
      );
    });
  }

  public render(): JSX.Element {
    return (
      <ul className="pr-tasks">
        {this.renderValues(this.props.values)}
      </ul>
    );
  }
}
