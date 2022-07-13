import {NodeElement} from './node-element';

export class AiElement extends NodeElement {
  aiType: string;
  aiTypeId: number;
  aiStringProperty: string;
  aiNumberProperty: number;
  additional: string;

  constructor() {
    super();

    this.aiType = '';
    this.aiTypeId = 0;
    this.aiStringProperty = '';
    this.aiNumberProperty = 0;
    this.additional = '';
  }
}
