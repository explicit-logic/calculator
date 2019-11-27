import * as React from "react";

import {Expression} from './../expression/Expression';
import {Result} from './../result/Result';

export class Scene extends React.Component {
  render() {
    return (
    <div className="expression-scene">
      <Expression />
      <Result />
    </div>
    );
  }
}
