import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { SettingDetailComponent }  from './setting-detail.component'

@NgModule({
  declarations: [
    SettingDetailComponent
  ],
  imports: [
    IonicModule,
    CommonModule
  ],
  exports: [
    SettingDetailComponent
  ]
})
export class SettingDetailModule { }
