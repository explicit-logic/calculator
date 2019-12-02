import * as React from "react";

import {Expression} from './Expression';
import {Result} from './Result';

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
