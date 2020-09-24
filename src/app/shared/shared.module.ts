import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { HomePageModule } from '../pages/home/home.module';
import { WorkerModule } from './components/worker/worker.module';
import { EquipmentModule } from './components/equipment/equipment.module';
import { SettingDetailModule } from '../pages/work-detail/setting-detail/setting-detail/setting-detail.module';


@NgModule({
  declarations: [ 
  ],
  imports: [
    CommonModule,    
    ReactiveFormsModule,
    WorkerModule,
    EquipmentModule,
    SettingDetailModule    
  ],
  exports: [ 
    WorkerModule,
    EquipmentModule,
    SettingDetailModule    
  ],
  providers: [
    //ProfilePageModule,
    HomePageModule,
    ReactiveFormsModule,
  ]
})
export class SharedModule { }
