import { NgModule  } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EquipmentComponent } from './equipment.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [
    EquipmentComponent,
  ],
  imports: [
    IonicModule,
    CommonModule
  ],
  exports: [
    EquipmentComponent, 
  ],
  entryComponents:[
  ],

})
export class EquipmentModule { }
