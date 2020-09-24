import { Component } from '@angular/core';

import { Platform, MenuController, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  private lblTitle = 'Controle Obra';
  private lblVersion = '0.0.2';
  public lblHome = 'Home';
  public lblProfiles = 'Perfil';
  public lblEquipments = 'Equipamentos';
  public lblWorkers = 'Trabalhadores';
  public lblContractor = 'Construtoras';
  public lblLogout = 'Logout';

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private menu: MenuController,
    private navCtrl: NavController,
    private authService: AuthService,

  ) {
    this.splashScreen.show();
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  getTitle() {
    return this.lblTitle.concat(' - v', this.lblVersion);
  }

  /* Configura o menu de acordo com o perfil do usuário */
  startMenu() {  }

  homeClick() {
    this.navCtrl.navigateRoot('home');
    this.menu.close();
  }

  profilesClick() {
    this.navCtrl.navigateRoot('profile-list');
    this.menu.close();
  }

  equipmantsClick() {
    this.navCtrl.navigateRoot('equipment-list');
    this.menu.close();
  }

  workersClick() {
    this,this.navCtrl.navigateRoot('worker-list');
    this.menu.close();
  }

  contractorsClick() {
    this,this.navCtrl.navigateRoot('contractor-list');
    this.menu.close();
  }

  logoutClick() {
    this.authService.logout();
    this.menu.close();
  }

  isDisabledProfile() {
    return false;
  }

  isDisabledEquipments(){
    return false;
  }

  isDisabledWorkers() {
    return false;
  }

  isDisableContractors() {
    return false;
  }

}
