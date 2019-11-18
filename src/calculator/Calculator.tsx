import * as React from "react";

export interface CalculatorProps { compiler: string; framework: string; }

export class Calculator extends React.Component<CalculatorProps, {}> {
  render() {
      return <h1>Hello from {this.props.compiler} and {this.props.framework}!</h1>;
  }
}
