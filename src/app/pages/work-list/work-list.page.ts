import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ToastController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { WorkService } from 'src/app/services/work.service';
import { Work } from 'src/app/interfaces/work';

@Component({
  selector: 'app-work-list',
  templateUrl: './work-list.page.html',
  styleUrls: ['./work-list.page.scss'],
})
export class WorkListPage implements OnInit {

  workCollection: Work[];
  workLoadedCollection: Work[];

  private loading: any;
  private workSubscription: Subscription;

  private textSearch = '';

  constructor(
    private service: WorkService,
    private aletCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private navCtrl: NavController
  ) { 
    this.loadWork();
  }

  ngOnInit() {}

  loadWork(): void {
    this.workSubscription = this.service.getAll().subscribe(data => {
      this.workCollection = data;
      this.workLoadedCollection = data;
    });
  }

  addWork(): void {
    this.navCtrl.navigateForward('/work');
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'Aguarde por favor...'
    });
    return this.loading.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000
    });
    toast.present();
  }

  async deleteWork(work) {
    const alert = await this.aletCtrl.create({
      header: 'Confirmação',
      message: 'Excluir ' + work.description,
      buttons: [
        {
          text: 'Cancelar',
          role: 'Cancel',
          cssClass: 'secundary',
          handler: () => {}
        },
        {
          text: "Ok",
          handler: async () => {
            await this.presentLoading();
            try {
              this.service.removeWork(work.id);
            } catch (error) {
              console.log('Erro ao excluir obra: ', error);
            } finally {
              this.loading.dismiss();
              this.presentToast('Obra excluída com sucesso.');
            }
          }
        }
      ] 
    });
    await alert.present();
  }

  ngOnDestroy(): void {
    this.workSubscription.unsubscribe();
  }

  search(event){
    this.initializeWork();
    this.textSearch = event.target.value;
    if (!this.textSearch){ return }

    this.workCollection = this.service.searchWork(this.workCollection, this.textSearch);
  }

  initializeWork() {
    this.workCollection = this.workLoadedCollection;
  }  

  comeback() {
    this.navCtrl.navigateBack('/home');
  }
}
