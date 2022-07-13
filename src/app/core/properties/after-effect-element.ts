import {NodeElement} from './node-element';

export class AfterEffectElement extends NodeElement{
  effect: string;
  effectNumberProperty: number;
  effectStringProperty: string;
  additional: string;

  constructor() {
    super();

    this.effect = '';
    this.effectNumberProperty = 0;
    this.effectStringProperty = '';
    this.additional = '';
  }
}
