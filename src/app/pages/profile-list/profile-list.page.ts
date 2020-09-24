import { Profile } from './../../interfaces/profile';
import { ProfileService } from './../../services/profile.service';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs/';
import { OverlayService } from 'src/app/services/overlay.service';

@Component({
  selector: 'app-profile-list',
  templateUrl: './profile-list.page.html',
  styleUrls: ['./profile-list.page.scss'],
})
export class ProfileListPage implements OnInit {
  
  profileCollection: Profile[];
  profileLoadedCollection: Profile[];

  private profileSubscription: Subscription;
  private loading: any;

  textSearch = '';


  constructor(
    private service: ProfileService,
    private navCtrl: NavController,
    private overlayService: OverlayService,
    ) {
    /* Carrega a lista de profile e atribui à coleção */
    this.loadProfile();
  }

  ngOnInit() { }

  async loadProfile() {
    this.loading = await this.overlayService.loading();
    this.profileSubscription =  this.service.getAll().subscribe(data => {
      this.profileCollection = data;
      this.profileLoadedCollection = data;
    });
    this.loading.dismiss();
  }

  /* Diálogo de confirmação de exclusão */
  async deleteProfile(profile) {
    const alert = await this.overlayService.alert({
      header: 'Confirmarção',
      message: 'Excluir ' + profile.description,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => { 
            /* Não faz nada ao cancelar */
          }
        }, {
          text: 'Ok',
          handler: async () => {
            this.loading = await this.overlayService.loading();
            try {
              this.service.removeProfile(profile.id);
            } catch (error) {
              console.error('Erro ao excluir perfil: ', error);
            } finally {
              this.loading.dismiss();
              this.overlayService.toast({ message: 'Perfil excluído com sucesso.'});
            }
          }
        }
      ]
    });
    
    await alert.present();
  }
  
  /* redireciono para a página de cadastro. Como não tem parametro, será tratado como um novo registro */
  addProfile() {
    this.navCtrl.navigateForward('/profile');
  }


  /* Teste Pesquisa*/

  
  search(event){
    this.initializeProfile();
    this.textSearch = event.target.value;
    if (!this.textSearch){ return }
    
    this.profileCollection = this.service.searchProfile(this.profileCollection, this.textSearch);
    //this.service.filterProfile(this.textSearch);
  }

  initializeProfile() {
    this.profileCollection = this.profileLoadedCollection;
  }
  
  ngOnDestroy(): void { this.profileSubscription.unsubscribe(); }
}

