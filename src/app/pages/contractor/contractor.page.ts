import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Contractor } from '../../interfaces/contractor';
import { ContractorService } from '../../services/contractor.service';
import { OverlayService } from '../../services/overlay.service';

@Component({
  selector: 'app-contractor',
  templateUrl: './contractor.page.html',
  styleUrls: ['./contractor.page.scss'],
})
export class ContractorPage implements OnInit {

  private contractorId: string;
  private contractorSubscription: Subscription;
  private loading: any;
  public contractor: Contractor = {};
  public form: FormGroup;

  action = 'Cadastro de Construtora'
  constructor(
    private activateRoute: ActivatedRoute,
    private service: ContractorService,
    private navCtrl: NavController,
    private overlayService: OverlayService,
    private formBuilder: FormBuilder,
  ) { 
    this.contractorId = this.activateRoute.snapshot.params['id'];
    if (this.contractorId) {
      this.loadContractor();
    }
  }

  ngOnInit() {
    this.action = !this.contractorId ? this.action : 'Alteração de dados';

    this.form =  this.formBuilder.group({
      companyName: [this.contractor.companyName, Validators.required],
      contactName: [this.contractor.contactName, Validators.required],
      contactEmail: [this.contractor.contactEmail, Validators.email],
      contactPhoneNumber: [this.contractor.contactPhoneNumber, ],
    })
  }

  loadContractor(){
    this.contractorSubscription = this.service.getContractor(this.contractorId)
      .subscribe(data => { this.form.setValue(data) });
  }

  async save() {
    this.loading = await this.overlayService.loading();
    if (this.contractorId) {
      try {
        await this.service.updateContractor(this.contractorId, this.form.value);
        this.navCtrl.navigateBack('/contractor-list');
      } catch (error) {
        this.overlayService.toast({ message: 'Error ao tentar salvar' });
      }
    } else {
      try {
        await this.service.addContractor(this.form.value);
        this.navCtrl.navigateBack('/contractor-list');
      } catch (error) {
        this.overlayService.toast({ message: 'Erro ao tentar salvar' });
      }
    }
    this.loading.dismiss();
  }

  cancel() {
    this.navCtrl.navigateBack('/contractor-list');
  }

  ngOnDestroy() {
    if (this.contractorSubscription) {
      this.contractorSubscription.unsubscribe();
    }
  }

}
