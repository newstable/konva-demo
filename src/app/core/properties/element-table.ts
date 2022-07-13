import {NodeElement} from './node-element';
import {AfterEffectElement} from './after-effect-element';
import {AiElement} from './ai-element';
import {AuditionElement} from './audition-element';
import {AviElement} from './avi-element';
import {BridgeElement} from './bridge-element';
import {CssElement} from './css-element';
import {GroupElement} from './group-element';

export class ElementTable {
  nodes: NodeElement[];
  afterEffects: AfterEffectElement[];
  ais: AiElement[];
  auditions: AuditionElement[];
  avis: AviElement[];
  bridges: BridgeElement[];
  csss: CssElement[];
  groups: GroupElement[];

  constructor() {
    this.nodes = [];
    this.afterEffects = [];
    this.ais = [];
    this.auditions = [];
    this.avis = [];
    this.bridges = [];
    this.csss = [];
    this.groups = [];
  }

  getIndividualTable(name?: string): Array<NodeElement | AfterEffectElement | AiElement | AuditionElement | AviElement | BridgeElement | CssElement | GroupElement> {
    if (name === 'ai') {
      return this.ais;
    } else if (name === 'afterEffect') {
      return this.afterEffects;
    } else if (name === 'audition') {
      return this.auditions;
    } else if (name === 'avi') {
      return this.avis;
    } else if (name === 'bridge') {
      return this.bridges;
    } else if (name === 'group') {
      return this.groups;
    } else {
      return this.nodes;
    }
  }
}
