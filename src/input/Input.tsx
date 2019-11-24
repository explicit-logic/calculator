import * as React from "react";

export interface InputProps {
  countParentheses: number;
  expression: any[];
}

export class Input extends React.Component<InputProps, {}> {
  render() {
      return <h4>{this.props.countParentheses}!</h4>;
  }
}
