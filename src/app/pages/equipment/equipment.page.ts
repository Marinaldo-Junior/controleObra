import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NavController } from '@ionic/angular';

import { Equipment } from 'src/app/interfaces/equipment';
import { EquipmentService } from 'src/app/services/equipment.service';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.page.html',
  styleUrls: ['./equipment.page.scss'],
})
export class EquipmentPage implements OnInit {

  public form: FormGroup;
  private _equipment: Equipment = {};
  
  constructor(
    private activatedRouter: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private navCtrl: NavController,
    private equipmentService: EquipmentService
  ) { 
    this._equipment = this.activatedRouter.snapshot.params;
  }

  ngOnInit() {
    
    this.form = this._formBuilder.group({
      description:      [this._equipment.description, [Validators.required, Validators.minLength(3), Validators.maxLength(35)]],
      type:             [this._equipment.type, [Validators.required]],
      acquisitionDate:  [this._equipment.acquisitionDate, ],
      acquisitionCost:  [this._equipment.acquisitionCost, ],
      allocated:        [this._equipment.allocated, ]      
    });
   }

  comeback() {
    this.navCtrl.navigateBack('/equipment-list');
  }

  save(){
    this._equipment['id'] ?
      this.equipmentService.updateEquipment(this._equipment['id'], this.form.value) :
      this.equipmentService.addEquipment(this.form.value)
  }

  cancel() {
    this.navCtrl.back();
  }
}
