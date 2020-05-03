import * as React from 'react';

import Expression from './expression/Expression';
import Result from './result/Result';

export default function Scene() {
  return (
    <div className="expression-scene">
      <Expression />
      <Result />
    </div>
  );
}
