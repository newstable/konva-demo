import { Injectable } from '@angular/core';
import {ElementTable} from '../properties/element-table';
import {NodeElement} from '../properties/node-element';
import {AiElement} from '../properties/ai-element';
import {AfterEffectElement} from '../properties/after-effect-element';
import {AuditionElement} from '../properties/audition-element';
import {AviElement} from '../properties/avi-element';
import {BridgeElement} from '../properties/bridge-element';
import {GroupElement} from '../properties/group-element';

@Injectable()
export class PropertyService {

  table: ElementTable = new ElementTable();

  constructor() { }

  create(id: string, name: string, object?: any) {
    const node = new NodeElement(id, name, object);
    this.table.nodes.push(node);

    if (name === 'ai') {
      const el = new AiElement();
      el.initNode(node);
      this.table.ais.push(el);
    } else if (name === 'afterEffect') {
      const el = new AfterEffectElement();
      el.initNode(node);
      this.table.afterEffects.push(el);
    } else if (name === 'audition') {
      const el = new AuditionElement();
      el.initNode(node);
      this.table.auditions.push(el);
    } else if (name === 'avi') {
      const el = new AviElement();
      el.initNode(node);
      this.table.avis.push(el);
    } else if (name === 'bridge') {
      const el = new BridgeElement();
      el.initNode(node);
      this.table.bridges.push(el);
    } else if (name === 'group') {

    }
  }

  getElementPropertyById(id: string): AiElement | AfterEffectElement | AuditionElement | AviElement | BridgeElement | GroupElement | NodeElement {
    try {
      const node = this.table.nodes.find(x => x.id === id);
      const table = this.table.getIndividualTable(node.name);
      return table.find(x => x.id === node.id);
    } catch (e) {
      return null;
    }
  }

  saveElementPropertyById(id: string, element) {
    try {
      const node = this.table.nodes.find(x => x.id === id);
      const table = this.table.getIndividualTable(node.name);
      const index = table.findIndex(x => x.id === node.id);
      table[index] = {...element};
      return {success: true}
    } catch (e) {
      return {success: false}
    }
  }
}
