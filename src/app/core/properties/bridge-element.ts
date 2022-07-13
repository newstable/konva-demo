import {NodeElement} from './node-element';

export class BridgeElement extends NodeElement {
  nodeTypeId: number;
  nodeType: string;
  nodeStringProperty: string;
  nodeNumberProperty: number;
  additional: string;

  constructor() {
    super();

    this.nodeTypeId = 0;
    this.nodeType = '';
    this.nodeStringProperty = '';
    this.nodeNumberProperty = 0;
    this.additional = '';
  }
}
