import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, } from '@angular/router'

import { Work } from '../../interfaces/work';
import { Worker } from '../../interfaces/worker';
import { Equipment } from 'src/app/interfaces/equipment';
import { DailyService } from 'src/app/services/daily.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import * as firebase from 'firebase';
import { OverlayService } from 'src/app/services/overlay.service';


@Component({
  selector: 'app-daily',
  templateUrl: './daily.page.html',
  styleUrls: ['./daily.page.scss'],
})
export class DailyPage implements OnInit {

  work: Work;
  
  //controle de exibição da seção
  showAddPhotosSec: boolean = false;
  showAddEquipmentsSec: boolean = false;
  showAddWorkersSec: boolean = false;

  // coleção de cada propriedade
  @Input() workerSelected: Worker[] = [];
  @Input() equipmentSelected: Equipment[] = [];
  equipmentsOfDay: Equipment[] = [];
  photosOfDay: string[] = [];

  form: FormGroup;

  constructor(
    private dailyService: DailyService,
    private activatedRouter: ActivatedRoute,
    private overlayService: OverlayService) { }

  ngOnInit() {

    this.work = this.activatedRouter.snapshot.params;

    this.form  = new FormGroup ({
      description:  new FormControl(Validators.required, Validators.minLength(5)),
      date:         new FormControl(Validators.required)
    });
  }

  controlOfVisibility(photos: boolean, equipments: boolean, workers: boolean) {
    this.showAddEquipmentsSec = equipments;
    this.showAddPhotosSec = photos;
    this.showAddWorkersSec = workers;
  }

  /* Obter todos os recursos para registrar a Daily 
    Método: transação ordenada: 1º daily, 2º (photos || equipments || workers) */
  save() {
    /* transforma a data para formato timestamp (firestore) */

    if (this.form.valid) {
      console.log('form: ', new Date(this.form.controls['date'].value + 1));
      console.log('firebase: ', firebase.firestore.Timestamp.fromDate(new Date(this.form.controls['date'].value + 1)));
      this.form.get('date').setValue(
        firebase.firestore.Timestamp.fromDate(new Date(this.form.controls['date'].value)));
        this.dailyService.save(this.work, this.form.value, null, this.workerSelected, this.equipmentSelected );
        this.overlayService.toast({
          message: 'Diário registrado com sucesso.'
        });
    } else {
      this.overlayService.toast({
        message: 'Descrição e data são obrigatórios.'
      });
    }
  }

  cancel() {
    //retornar para work-detail
  }

  verifyOption(ev: CustomEvent) {
    let num = parseInt(Object.values(ev.detail).toString());
    switch (num) {
      case 1: this.addPhotos();
        break;
      case 2: this.addEquipments();
        break;
      case 3: this.addWorkers();
        break;
    }
  }

  addPhotos() {
    this.controlOfVisibility(true, false, false);
  }
  
  addEquipments() {
    this.controlOfVisibility(false, true, false);
  }
  
  addWorkers() {
    this.controlOfVisibility(false, false, true);
  }
}
