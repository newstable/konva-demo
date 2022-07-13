import {NodeElement} from './node-element';

export class CssElement extends NodeElement {
  cssType: string;
  cssTypeId: number;
  cssStringProperty: string;
  cssNumberProperty: number;
  additional: string;

  constructor() {
    super();

    this.cssType = '';
    this.cssTypeId = 0;
    this.cssStringProperty = '';
    this.cssNumberProperty = 0;
    this.additional = '';
  }
}
