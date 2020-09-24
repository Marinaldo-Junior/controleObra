import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ContractorPage } from './contractor.page';

const routes: Routes = [
  {
    path: '',
    component: ContractorPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    ContractorPage
  ],
  providers: [
    ReactiveFormsModule
  ]

})
export class ContractorPageModule {}
