import { Profile } from './../../interfaces/profile';
import { ProfileService } from './../../services/profile.service';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NavController, LoadingController, ToastController } from '@ionic/angular';

import { Subscription } from 'rxjs/';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  private profileId: string;
  private profileSubscription: Subscription;
  private loading: any;
  public profile: Profile = {};

  constructor(
    private activatedRoute: ActivatedRoute,
    private service: ProfileService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController

  ) {
    /*  Obtém o ID da tela chamadora: profile-list.page.html > [routerLink]="['/profile', profile] 
        O 2º parametro contém o objeto profile; com "params['id']" eu pego somente o id.
    */
    this.profileId = this.activatedRoute.snapshot.params['id'];

    /* Se o profileId estiver preenchido, carrego os dados e apresento. */
    if (this.profileId) {
      this.loadProfile();
    }
  }

  ngOnInit() { }

  /* Carrego o objeto Profile e fica escutando qualquer alteração pelo subscription
     OBS: é importante atribuir ao this.profileSubscription para que possa ser removida a subscrição ao sair da tela.
  */
  loadProfile() {
    this.profileSubscription = this.service.getProfile(this.profileId)
      .subscribe(data => {
        this.profile = data
    });
  }

  async save() {
    /* Verifica se o profileId está preenchido  */
    if (this.profileId) {
      try {
        /* Caso afirmativo, é realizado um update */
        await this.service.updateprofile(this.profileId, this.profile);
        /* depois retorna para a tela de lista */
        this.navCtrl.navigateBack('/profile-list');
      } catch (error) {
        console.error(error);
        this.presentToast('Erro ao tentar salvar');
      }
    } else {
      try {
        this.profile.inUse = false;
        /* Caso contrário, é realizado um create no firestore */
        await this.service.addProfile(this.profile);
        /* depois retorna para a tela de lista */
        this.navCtrl.navigateBack('/profile-list');
      } catch (error) {
        console.error(error);
        this.presentToast('Erro ao tentar salvar');
      }
    }
  }

  /* apresenta a janela de aguarde... */
  async presentLoading() {
    this.loading = await this.loadingCtrl.create({ message: 'Aguarde...' });
    return this.loading.present();
  }

  /* apresenta o toast com mensagem passada por parametro.  */
  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000 });
    toast.present();
  }

  cancel() {
    /* Ao cancelar, retorna à tela de lista */
    this.navCtrl.navigateBack('/profile-list');
  }

  ngOnDestroy() {
    /* Ao sair da tela é necessário desinscrever do profileSubscription para não ficar ligado, consumindo recurso */
    if (this.profileSubscription) {
      this.profileSubscription.unsubscribe();
    }
  }
}
