import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Contractor } from '../../interfaces/contractor';
import { ContractorService } from '../../services/contractor.service';
import { OverlayService } from '../../services/overlay.service';


@Component({
  selector: 'app-contractor-list',
  templateUrl: './contractor-list.page.html',
  styleUrls: ['./contractor-list.page.scss'],
})
export class ContractorListPage implements OnInit {

  contractorCollection: Contractor[];
  contractorLoadedCollection: Contractor[];

  private loading: any;
  private contractorSubscription: Subscription;
  private textSearch = '';

  constructor(
    private contractorService: ContractorService,
    private overlayService: OverlayService
  ) { 
    this.loadContractor();
  }

  ngOnInit() {}

  async loadContractor() {
    this.loading = await this.overlayService.loading();
    this.contractorSubscription = this.contractorService.getAll().subscribe(data => {
      this.contractorCollection = data;
      this.contractorLoadedCollection = data;
    } );
    this.loading.dismiss()
  }

  async deleteContractor(contractor) {
    const alert = await this.overlayService.alert({
      header: 'Confirmação',
      message: 'Excluir ' + contractor.companyName,
      buttons: [
        {
          text: 'Cancelar',
          role: 'Cancel',
          cssClass: 'secundary',
          handler: () => {}
        },
        {
          text: 'Ok',
          handler: async () => {
            this.loading =await this.overlayService.loading();
            try {
              this.contractorService.removeContractor(contractor.id);
            } catch (error) {
              console.log(error)
            } finally {
              this.loading.dismiss();
              this.overlayService.toast({
                message: 'Construtora excluída com sucesso.'
              });
            }
          }
        }
      ]
    });
    await alert.present();
  }

  search(event){
    this.initializeContrator();
    const textSearch = event.target.value;
    if (!textSearch) { return }

    this.contractorCollection = this.contractorCollection.filter(currentContrator => {
      if (currentContrator.companyName && textSearch) {
        if (currentContrator.companyName.toLowerCase().indexOf(textSearch.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    })
  }

  initializeContrator() {
    this.contractorCollection = this.contractorLoadedCollection;
  }

  ngOnDestroy() {
    this.contractorSubscription.unsubscribe();
  }
}
