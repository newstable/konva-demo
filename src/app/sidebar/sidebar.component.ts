import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { KonvaService } from '../core/services/konva.service';
import { PropertyService } from '../core/services/property.service';
import { PropertyEvent } from '../core/interfaces/property-event';
import {NodeElement} from '../core/properties/node-element';
import {AiElement} from '../core/properties/ai-element';
import {AviElement} from '../core/properties/avi-element';
import {AfterEffectElement} from '../core/properties/after-effect-element';
import {AuditionElement} from '../core/properties/audition-element';
import {GroupElement} from '../core/properties/group-element';
import {CssElement} from '../core/properties/css-element';
import {BridgeElement} from '../core/properties/bridge-element';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {

  showPropertySubscription: Subscription = new Subscription();

  selectedObject: NodeElement | AiElement | AviElement | AfterEffectElement | AuditionElement | GroupElement | CssElement | BridgeElement = null;
  properties: string[] = [];

  constructor(
    private konvaService: KonvaService,
    private propertyService: PropertyService
  ) { }

  ngOnInit() {
    this.showPropertySubscription = this.konvaService.showProperty.subscribe((evt: PropertyEvent) => {
      this.selectedObject = this.propertyService.getElementPropertyById(evt.id);
      this.buildForm();
    });
  }

  ngOnDestroy() {
    this.showPropertySubscription.unsubscribe();
  }

  buildForm() {
    try {
      this.properties = [];
      Object.keys(this.selectedObject).forEach(pro => {
        if (pro !== 'id' && pro !== 'name' && pro !== 'object') {
          this.properties.push(pro);
        }
      })
    } catch (e) {
      console.log(e);
    }
  }

  saveProperty() {
    const flag = this.propertyService.saveElementPropertyById(this.selectedObject.id, this.selectedObject);
  }

}
