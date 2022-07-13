import {NodeElement} from './node-element';

export class AviElement extends NodeElement{

  aviType: string;
  aviTypeId: number;
  aviStringProperty: string;
  aviNumberProperty: number;
  additional: string;

  constructor() {
    super();

    this.aviTypeId = 0;
    this.aviType = '';
    this.aviStringProperty = '';
    this.aviNumberProperty = 0;
    this.additional = '';
  }

}
