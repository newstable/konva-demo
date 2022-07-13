import { Component, AfterViewInit } from '@angular/core';
import { KonvaService } from './core/services/konva.service';
import { PropertyService } from './core/services/property.service';
import * as Konva from 'konva';
import { POINTER } from './core/services/konva.service';
import { ELEMENT_HEIGHT, ELEMENT_WIDTH } from './core/services/konva.service';
import { LinkBtnStatus } from './core/interfaces/link-btn-status';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit{

  stage: any;             // main stage

  backgroundLayer: any;   // layers
  mainLayer: any;
  lineLayer: any;
  tempLayer: any;
  paletteLayer: any;

  clickListenerZone: any; // custom rect

  pointer = POINTER.single; // settings
  linkBtnStatus: LinkBtnStatus = {enable: false, link: true};

  constructor(
    public konvaService: KonvaService,
    private propertyService: PropertyService
  ) {}

  ngAfterViewInit() {
    this.stage = KonvaService.createStage('konvaboard', window.innerWidth, window.innerHeight);
    this.mainLayer = new Konva.Layer();
    this.lineLayer = new Konva.Layer();
    this.backgroundLayer = new Konva.Layer();
    this.tempLayer = new Konva.Layer();
    this.paletteLayer = new Konva.Layer();

    this.stage.add(this.backgroundLayer); // hack background click event
    this.stage.add(this.lineLayer);       // linked lines
    this.stage.add(this.mainLayer);       // component layer
    this.stage.add(this.tempLayer);       // dragging layer
    this.stage.add(this.paletteLayer);    // palette layer

    this.drawPaletteBox();
    this.handleBackgroundClickEventOnStage();
    this.handleDragEventOnStage();
  }

  addFromDrag(element) {
    if (element.name === 'group') {
      const res = KonvaService.addNewGroup(element.x, element.y);
      res.rect.on('mousemove', (event) => this.groupMouseCursorHandle(event, 'mousemove'));
      res.rect.on('mouseout', (event) => this.groupMouseCursorHandle(event, 'mouseout'));
      res.group.on('dragstart', (event) => this.groupMouseCursorHandle(event, 'dragstart'));
      res.group.on('dragmove', (event) => this.componentDragMove(event, {name: 'group'}));
      res.group.on('click', (event) => this.componentClick(event, {name: 'group'}));
      this.mainLayer.add(res.group);
      this.mainLayer.draw();
    } else {
      const el = KonvaService.addNewComponent(element.image, element.x, element.y, element.width, element.height, element.name);
      this.mainLayer.add(el);
      el.on('click', (event => this.componentClick(event, element.name)));
      el.on('dragmove', (event => this.componentDragMove(event)));
      this.mainLayer.draw();
      this.propertyService.create(el.id(), el.name(), el);
    }
  }

  join(line: any) {
    if (!line) {
      const el_1 = this.stage.findOne(`#${this.konvaService.selectedItems[0]}`);
      const el_2 = this.stage.findOne(`#${this.konvaService.selectedItems[1]}`);
      this.lineLayer.add(KonvaService.drawLinkLine(el_1, el_2));
      this.linkBtnStatus = this.konvaService.getLinkedStatus(this.stage); // get latest status
      // this.konvaService.unSelectAll(this.stage); // we don't need to unselect all for now
    } else {
      line.destroy();
      this.linkBtnStatus = this.konvaService.getLinkedStatus(this.stage); // get latest status
    }
    this.lineLayer.draw();
    this.mainLayer.draw();
  }

  componentClick(event, type) {
    this.konvaService.layerClickedEvent(this.pointer, event, this.stage, type);
    this.linkBtnStatus = this.konvaService.getLinkedStatus(this.stage);
    this.mainLayer.draw();
  }

  componentDragMove(event, type = null) {
    this.stage.find('Arrow').forEach(line => {
      let x1, x2, y1, y2, h1, h2, w1, w2 = 0;
      const splitter = line.attrs.id.search('-');
      const e1 = this.stage.findOne(`#${line.attrs.id.substring(0, splitter)}`);
      const e2 = this.stage.findOne(`#${line.attrs.id.substring(splitter + 1, line.attrs.id.length)}`);
      if (event.target.attrs.id === e1.attrs.id) {
        x1 = event.target.attrs.x;
        y1 = event.target.attrs.y;
        w1 = event.target.attrs.width;
        h1 = event.target.attrs.height;
        x2 = e2.className === 'Rect' ? e2.parent.attrs.x : e2.attrs.x;
        y2 = e2.className === 'Rect' ? e2.parent.attrs.y : e2.attrs.y;
        w2 = e2.attrs.width;
        h2 = e2.attrs.height;
        line.attrs.points = KonvaService.calculateLinkLine(x1, y1, x2, y2, w1, h1, w2, h2);
        this.stage.draw();
      } else if (event.target.attrs.id + 'rect' === e1.attrs.id) {
        x1 = event.target.attrs.x;
        y1 = event.target.attrs.y;
        w1 = e1.className === 'Rect' ? e1.attrs.width : ELEMENT_WIDTH;
        h1 = e1.className === 'Rect' ? e1.attrs.height : ELEMENT_HEIGHT;
        x2 = e2.className === 'Rect' ? e2.parent.attrs.x : e2.attrs.x;
        y2 = e2.className === 'Rect' ? e2.parent.attrs.y : e2.attrs.y;
        w2 = e2.attrs.width;
        h2 = e2.attrs.height;
        line.attrs.points = KonvaService.calculateLinkLine(x1, y1, x2, y2, w1, h1, w2, h2);
        this.stage.draw();
      } else if (event.target.attrs.id === e2.attrs.id) {
        x2 = event.target.attrs.x;
        y2 = event.target.attrs.y;
        w2 = event.target.attrs.width;
        h2 = event.target.attrs.height;
        x1 = e1.className === 'Rect' ? e1.parent.attrs.x : e1.attrs.x;
        y1 = e1.className === 'Rect' ? e1.parent.attrs.y : e1.attrs.y;
        w1 = e1.attrs.width;
        h1 = e1.attrs.height;
        line.attrs.points = KonvaService.calculateLinkLine(x1, y1, x2, y2, w1, h1, w2, h2);
        this.stage.draw();
      } else if (event.target.attrs.id + 'rect' === e2.attrs.id) {
        x2 = event.target.attrs.x;
        y2 = event.target.attrs.y;
        w2 = e2.attrs.width;
        h2 = e2.attrs.height;
        x1 = e1.className === 'Rect' ? e1.parent.attrs.x : e1.attrs.x;
        y1 = e1.className === 'Rect' ? e1.parent.attrs.y : e1.attrs.y;
        w1 = e1.attrs.width;
        h1 = e1.attrs.height;
        line.attrs.points = KonvaService.calculateLinkLine(x1, y1, x2, y2, w1, h1, w2, h2);
        this.stage.draw();
      }
    })
  }

  groupMouseCursorHandle(event, method) {
    if (method === 'mouseout') {
      this.stage.container().style.cursor = 'default';
    } else if (method === 'mousemove') {
      if ((event.target.parent.attrs.x + event.target.attrs.width - 2) <= event.evt.offsetX && event.evt.offsetX <= (event.target.parent.attrs.x + event.target.attrs.width + 2)) {
        this.stage.container().style.cursor = 'pointer';
      } else {
        this.stage.container().style.cursor = 'default';
      }
    } else if (method === 'dragstart') {
      // TODO: handle group rect events
    } else if (method === 'dragmove') {
      // TODO: handle group rect events
    }
  }

  private handleDragEventOnStage() {
    this.stage.on('dragstart', (e) => {
      e.target.moveTo(this.tempLayer);
      this.mainLayer.draw();
    });

    let previousShape;

    this.stage.on('dragmove', (evt) => {
      const pos = this.stage.getPointerPosition();
      const shape = this.mainLayer.getIntersection(pos);
      if (previousShape && shape && shape.getClassName() === 'Rect') {
        if (previousShape !== shape) {
          // leave from old targer
          previousShape.fire('dragleave', {type : 'dragleave', target : previousShape, evt : evt.evt}, true);
          // enter new targer
          shape.fire('dragenter', {type : 'dragenter', target : shape, evt : evt.evt}, true);
          previousShape = shape;
        } else {
          previousShape.fire('dragover', {type : 'dragover', target : previousShape, evt : evt.evt}, true);
        }
      } else if (!previousShape && shape && shape.getClassName() === 'Rect') {
        previousShape = shape;
        shape.fire('dragenter', {type : 'dragenter', target : shape, evt : evt.evt}, true);
      } else if (previousShape && !shape) {
        previousShape.fire('dragleave', {type : 'dragleave', target : previousShape, evt : evt.evt}, true);
        previousShape = undefined;
      }
    });

    this.stage.on('dragend', (e) => {
      const pos = this.stage.getPointerPosition();
      const shape = this.mainLayer.getIntersection(pos);
      let group = null;
      let rect = null;
      if (previousShape && shape && shape.getClassName() === 'Rect') {
        previousShape.fire('drop', {type : 'drop', target : previousShape, evt : e.evt}, true);
        group = this.stage.findOne(`#${previousShape.parent.getId()}`);
        rect = this.stage.findOne(`#${previousShape.getId()}`);
      }
      previousShape = undefined;
      e.target.moveTo(this.mainLayer);
      if (group) {
        const item = this.stage.findOne(`#${e.target.getId()}`);
        item.x(KonvaService.getGroupPosition(group, rect.attrs.width, rect.attrs.height).x);
        item.y(KonvaService.getGroupPosition(group, rect.attrs.width, rect.attrs.height).y);
        item.draggable(false);
        item.moveTo(group);
      }
      this.mainLayer.draw();
      this.tempLayer.draw();
    });

    this.stage.on('dragenter', (e) => {
      e.target.stroke('green');
      this.mainLayer.draw();
    });

    this.stage.on('dragleave', (e) => {
      e.target.stroke('#0094ff');
      this.mainLayer.draw();
    });

    this.stage.on('drop', (e) => {
      this.mainLayer.draw();
    });
  }

  private handleBackgroundClickEventOnStage() {
    this.clickListenerZone = new Konva.Rect({
      x: 0,
      y: 0,
      width: window.innerWidth,
      height: window.innerHeight,
      fill: 'white',
      stroke: 'black',
      strokeWidth: 0
    });

    this.clickListenerZone.on('click', (event) => {
      this.konvaService.unSelectAll(this.stage);
      this.linkBtnStatus = this.konvaService.getLinkedStatus(this.stage);
      this.mainLayer.draw();
    });

    // add the click lis  tener zone to the layer
    this.backgroundLayer.add(this.clickListenerZone);
    this.backgroundLayer.draw();

  }

  private drawPaletteBox() {
    const sources = {
      frame: 'assets/palette_frame.svg',
      ai: 'assets/svg/ai.svg',
      afterEffect: 'assets/svg/after-effects.svg',
      audition: 'assets/svg/audition.svg',
      avi: 'assets/svg/avi.svg',
      bridge: 'assets/svg/bridge.svg',
      css: 'assets/svg/css.svg',
      group: 'assets/svg/collaboration.svg'
    };
    const paletteGroup = new Konva.Group({x: 5, y: 5, draggable: false});
    this.konvaService.loadImageSources(sources, (images) => {
      const paletteFrame = new Konva.Image({x: 0, y: 0, image: images.frame, width: 49, height: 286, draggable: false,
            shadowColor: 'black',
            shadowBlur: 5,
            shadowOffset: {x : 2, y : 2},
            shadowOpacity: 0.2});
      paletteGroup.add(paletteFrame);
      let index = 0;
      for (const item in images) {
        if (item !== 'frame') {
          const heightOffset = index * (ELEMENT_HEIGHT + 6) + 23;
          const btn = new Konva.Image({name: item, x: 10, y: heightOffset, image: images[item], width: ELEMENT_WIDTH, height: ELEMENT_HEIGHT, draggable: true});
          const btnPos =  {x: 10, y: heightOffset};
          paletteGroup.add(btn);
          index ++;

          btn.on('dragend', (event) => {
            this.addFromDrag(event.target.attrs);
            event.target.x(btnPos.x);
            event.target.y(btnPos.y);
            this.paletteLayer.draw();
          });
        }
      }
      // stop drag and drop propagation from palette layer
      this.paletteLayer.on('dragstart', (evt) => {evt.cancelBubble = true});
      this.paletteLayer.on('dragmove', (evt) => {evt.cancelBubble = true});
      this.paletteLayer.on('dragend', (evt) => {evt.cancelBubble = true});
      this.paletteLayer.add(paletteGroup);
      this.paletteLayer.draw();
    });
  }
}
