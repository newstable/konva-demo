import { Injectable, EventEmitter } from '@angular/core';
import * as Konva from 'konva';

import { LinkBtnStatus } from '../interfaces/link-btn-status';
import { PropertyEvent } from '../interfaces/property-event';

export enum POINTER {
  single = 1,
  multi = 2
}

export const ELEMENT_WIDTH = 30;
export const ELEMENT_HEIGHT = 30;

@Injectable()
export class KonvaService {

  selectedItems = [];
  showProperty: EventEmitter<any> = new EventEmitter<any>();

  get selectedIds() {
    return this.selectedItems;
  }

  constructor() { }

  layerClickedEvent(pointer: POINTER, event, stage, type) {
    const index = this.selectedItems.findIndex(x => x === event.target.attrs.id);
    if (index > -1) {
      KonvaService.selectElement(event.target, false);
      this.selectedItems.splice(index, 1);
    } else {
      KonvaService.selectElement(event.target, true);
      this.selectedItems.push(event.target.attrs.id);
      // send selected object info to sidebar component
      const evt: PropertyEvent = {id: event.target.attrs.id, type: event.target.attrs.name, object: event.target};
      this.showProperty.emit(evt);

      if (this.selectedItems.length > (pointer === POINTER.single ? 1 : 2)) { // selected items should be only 2
        KonvaService.selectElement(stage.findOne(`#${this.selectedItems[0]}`), false);
        this.selectedItems.splice(0, 1);
      }
    }
  }

  unSelectAll(stage) {
    this.selectedItems.forEach(x => {
      const el = stage.findOne(`#${x}`);
      KonvaService.selectElement(el, false);
    });
    this.selectedItems = [];
  }

  loadImageSources(sources, callback) {
    let images = {};
    let loadedImages = 0;
    let numImages = Object.keys(sources).length;
    for (const src in sources) {
      images[src] = new Image();
      images[src].onload = () => {
        if (++loadedImages >= numImages) {
          callback(images)
        }
      };
      images[src].src = sources[src];
    }
  }

  getLinkedStatus(stage: any): LinkBtnStatus {
    let status: LinkBtnStatus = {enable: false, link: true};
    if (this.selectedItems.length < 2) {
      status.enable = false;
      status.link = true;
    } else {
      status.enable = true;
      status.link = stage.findOne(`#${this.selectedItems[0]}-${this.selectedItems[1]}`) || stage.findOne(`#${this.selectedItems[1]}-${this.selectedItems[0]}`);
    }
    return status;
  }

  static createStage(container: string, width: number, height: number) {
    return new Konva.Stage({
      container: container,
      width: width,
      height: height
    });
  }

  static addNewComponent(imageObj, x, y, w, h, name) {
    const idString = new Date().getMilliseconds().toString();
    return new Konva.Image({
      x: x,
      y: y,
      width: w,
      height: h,
      image: imageObj,
      draggable: true,
      id: idString,
      name: name
    });
  }

  static addNewGroup(px = 0, py = 0) {
    const idString = new Date().getMilliseconds().toString();
    const rect = new Konva.Rect({id: idString + 'rect', x: 0, y: 0, width: 100, height: 200, stroke: '#0094ff', strokeWidth: 1, dash: [10, 2], fill: 'white'});
    const group = new Konva.Group({draggable: true, x: px, y: py, id: idString});
    group.add(rect);
    return {group: group, rect: rect};
  }

  static selectElement(el, selectFlag: boolean) {
    if (el.className === 'Rect') {
      if (selectFlag) {
        el.attrs.stroke = '#005eff';
        el.attrs.strokeWidth = 1;
      } else {
        el.attrs.stroke = '#0094ff';
        el.attrs.strokeWidth = 1;
      }
    } else {
      if (selectFlag) {
        el.attrs.stroke = '#005eff';
        el.attrs.strokeWidth = 2;
      } else {
        el.attrs.stroke = 'white';
        el.attrs.strokeWidth = 0;
      }
    }
  }

  static calculateLinkLine(x1, y1, x2, y2, w1 = ELEMENT_WIDTH, h1 = ELEMENT_HEIGHT, w2 = ELEMENT_WIDTH, h2 = ELEMENT_HEIGHT) {
    let linePoints = [];
    const cx1 = x1 + w1 / 2;
    const cy1 = y1 + h1 / 2;
    const cx2 = x2 + w2 / 2;
    const cy2 = y2 + h2 / 2;
    linePoints = [cx1, cy1, cx2, y2 + h2];
    if (((cx2 > cx1) && (cy2 > cy1) && ((cx2 - cx1) > (cy2 - cy1))) || ((cx2 > cx1) && (cy2 < cy1) && ((cy1 - cy2) < (cx2- cx1)))) {
      linePoints = [cx1, cy1, x2, cy2];
    }
    if (((cy2 > cy1) && ((cy2 - cy1) > (cx2 - cx1)) && (cx1 < cx2)) || ((cy2 > cy1) && (cx2 < cx1) && (cx1 - cx2) < (cy2 - cy1))) {
      linePoints = [cx1, cy1, cx2, y2];
    }
    if (((cx1 > cx2) && ((cy2 - cy1) < (cx1 - cx2)) && (cy2 > cy1)) || ((cx1 > cx2) && (cy2 < cy1) && ((cx1 - cx2) > (cy1 - cy2)))) {
      linePoints = [cx1, cy1, x2 + w2, cy2];
    }
    if (((cy1 > cy2) && (cx1 < cx2) && ((cy1 - cy2) > (cx2 - cx1))) || ((cy1 > cy2) && (cx1 > cx2) && ((cy1 - cy2) > (cx1 - cx2)))) {
      linePoints = [cx1, cy1, cx2, y2 + h2];
    }
    if ((cy1 === cy2) && (cx1 < cx2)) {
      linePoints = [cx1, cy1, x2, cy2];
    }
    if ((cy1 === cy2) && (cx2 < cx1)) {
      linePoints = [cx1, cy1, x2 + w2, cy2];
    }
    if ((cy1 < cy2) && (cx2 === cx1)) {
      linePoints = [cx1, cy1, cx2, y2];
    }
    if ((cy1 > cy2) && (cx2 === cx1)) {
      linePoints = [cx1, cy1, cx2, y2 + w2];
    }
    return linePoints;
  }

  static drawLinkLine(e1, e2) {
    const x1 = e1.className === 'Rect' ? e1.parent.attrs.x : e1.attrs.x;
    const w1 = e1.className === 'Rect' ? e1.attrs.width : ELEMENT_WIDTH;
    const y1 = e1.className === 'Rect' ? e1.parent.attrs.y : e1.attrs.y;
    const h1 = e1.className === 'Rect' ? e1.attrs.height : ELEMENT_HEIGHT;
    const x2 = e2.className === 'Rect' ? e2.parent.attrs.x : e2.attrs.x;
    const w2 = e2.className === 'Rect' ? e2.attrs.width : ELEMENT_WIDTH;
    const y2 = e2.className === 'Rect' ? e2.parent.attrs.y : e2.attrs.y;
    const h2 = e2.className === 'Rect' ? e2.attrs.height : ELEMENT_HEIGHT;
    return new Konva.Arrow({
      points: KonvaService.calculateLinkLine(x1, y1, x2, y2, w1 , h1, w2, h2),
      stroke: '#545454',
      strokeWidth: 1,
      lineCap: 'round',
      lineJoin: 'round',
      fill: 'black',
      id: e1.attrs.id + '-' + e2.attrs.id
    });
  }

  static getGroupPosition(group, width, height) {
    const ox = width / 2;
    const oy = height / 2;
    const length = group.children.length - 1;
    return {y: 10 + ((ELEMENT_HEIGHT + 10) * Math.floor(length / 2)), x: Math.abs(length % 2) == 1 ? 60 : 10};
  }
}
