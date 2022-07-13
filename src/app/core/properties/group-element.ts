import {NodeElement} from './node-element';

export class GroupElement extends NodeElement {
  totalCounts: number;
  elements: Array<NodeElement>;

  constructor() {
    super();

    this.totalCounts = 0;
    this.elements = [];
  }
}
