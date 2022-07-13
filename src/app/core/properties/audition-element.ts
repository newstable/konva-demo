import {NodeElement} from './node-element';

export class AuditionElement extends NodeElement {
  nodeType: string;
  nodeTypeId: number;
  nodeStringProperty: string;
  nodeNumberProperty: number;
  additional: string;

  constructor() {
    super();

    this.nodeType = '';
    this.nodeTypeId = 0;
    this.nodeStringProperty = '';
    this.nodeNumberProperty = 0;
    this.additional = '';
  }
}
