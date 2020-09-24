import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Work } from '../../interfaces/work';
import { WorkService } from '../../services/work.service';
import { NavController, LoadingController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-work',
  templateUrl: './work.page.html',
  styleUrls: ['./work.page.scss'],
})

export class WorkPage implements OnInit {

  private workId: string;
  private workSubscription: Subscription;
  private loading: any;
  public work: Work = {};

  action = "Cadastro de obras";

  constructor(
    private activateRoute: ActivatedRoute,
    private service: WorkService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    this.workId = this.activateRoute.snapshot.params['id'];
    if (this.workId) {
      this.loadWork();
    }
  }

  ngOnInit() { 
    this.action = !this.workId ? this.action : 'Alteração de dados';
  }

  loadWork() {
    this.workSubscription = this.service.getWork(this.workId).subscribe(data => {
      this.work = data;
    });
  }

  async save() {
    if (this.workId) {
      try {
        await this.service.updatework(this.workId, this.work);
        this.navCtrl.navigateBack('/work-list');
      } catch (error) {
        this.presentToast('Error ao tentar salvar');
      }
    } else {
      try {
        await this.service.addwork(this.work);
        this.navCtrl.navigateBack('/work-list');
      } catch (error) {
        this.presentToast('Erro ao tentar salvar');
      }
    }
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({ 
      message: 'Aguarde...'
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

  cancel() {
    this.navCtrl.navigateBack('/work-list');
  }

  ngOnDestroy() {
    if (this.workSubscription) {
      this.workSubscription.unsubscribe();
    }
  }
}
