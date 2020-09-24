import { NgModule  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { WorkerComponent } from './worker.component';

@NgModule({
  declarations: [
    WorkerComponent,
  ],
  imports: [
    IonicModule,
    CommonModule
  ],
  exports:[
    WorkerComponent,
  ]
})
export class WorkerModule { }
