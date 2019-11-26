import * as React from "react";

export interface BaseBlockProps { id: string; value: string };

export const BaseBlock = (props: BaseBlockProps) =>
  (<span id={"blk_"+props.id} className="">{props.value}</span>);
