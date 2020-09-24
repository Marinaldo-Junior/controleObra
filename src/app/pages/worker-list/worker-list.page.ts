import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { WorkerService } from 'src/app/services/worker.service';
import { NavController } from '@ionic/angular';
import { Worker } from 'src/app/interfaces/worker';
import { Profile } from 'src/app/interfaces/profile';
import { ProfileService } from 'src/app/services/profile.service';
import { OverlayService } from 'src/app/services/overlay.service';

@Component({
  selector: 'app-worker-list',
  templateUrl: './worker-list.page.html',
  styleUrls: ['./worker-list.page.scss'],
})
export class WorkerListPage implements OnInit {

  workerCollection: Worker[];
  workerLoadedCollection: Worker[];

  public profile: Profile = {};
  private profileId: string;

  private textSearch = '';

  private loading: any;
  private workerSubscription: Subscription;

  constructor(
    private profileService: ProfileService,
    private service: WorkerService,
    private navCtrl: NavController,
    private overlayService: OverlayService
  ) {
    this.loadWorker();
   }

  ngOnInit() {}

  async loadWorker() {
    this.loading = await this.overlayService.loading();
    this.workerSubscription = this.service.getAll().subscribe(data => {
      this.workerCollection = data;
      this.workerLoadedCollection = data;
    });
    this.loading.dismiss();
  }

  addWorker() {
    this.navCtrl.navigateForward('/worker');
  }

  editWorker(worker) {
    //TODO Rever este tratamento de perfil
    this.profile.inUse = false;
    this.profileId = worker.profile.id;
    //this.profileService.updateprofile(this.profileId, this.profile);
  }

  async deleteWorker(worker) {
    this.profileId = worker.profile.uid;
    this.profile.inUse = false;
    const alert = await this.overlayService.alert({
      header: 'Confirmação',
      message: 'Excluir ' + worker.name,
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
            this.loading = await this.overlayService.loading();
            try {
              this.service.removeWorker(worker.uid);
              await this.profileService.updateprofile(worker.profile.uid, worker.profile);
            } catch (error) {
              console.log('Erro ao excluir Trabalhador: ', error);
            } finally {
              this.loading.dismiss();
              this.overlayService.toast({
                message: 'Trabalhador excluído com sucesso.'
              });
            }
          }
        }
      ]
    });
    await alert.present();
  }

  search(event){
    this.initializeWorker();
    this.textSearch = event.target.value;
    if (!this.textSearch){ return }

    this.workerCollection = this.service.searchWorker(this.workerCollection, this.textSearch);
  }

  initializeWorker() {
    this.workerCollection = this.workerLoadedCollection;
  }
  // tslint:disable-next-line: use-lifecycle-interface
  ngOnDestroy() {
    this.workerSubscription.unsubscribe();
  }
}
