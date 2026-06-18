import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonAccordionGroup,
  IonAccordion,
  IonItem, IonLabel
} from '@ionic/angular/standalone';
import {addIcons} from "ionicons";
import {caretDownCircle} from "ionicons/icons";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonAccordionGroup, IonAccordion, IonItem, IonLabel, NgForOf, NgIf]
})
export class Tab2Page {
  customSymbolSet: string = [...'~!@#$%^&*(){|}[]_+=-<>?/\':;",.`'].join(', ');
  constructor() {
    addIcons({caretDownCircle})
  }

}
