import * as React from "react";
import { BaseBlock as BlockModel } from '../models/blocks/BaseBlock';

export interface BlockProps { model: BlockModel };

export const Block = (props: BlockProps) =>(
  <span id={props.model.id} className={props.model.className()}>
  {props.model.formattedValue()}
  </span>
  );
