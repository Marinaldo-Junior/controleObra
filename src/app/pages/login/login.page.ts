import { Subscription } from 'rxjs/';
import { AuthService } from './../../services/auth.service';
import { User } from '../../interfaces/user';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, LoadingController, ToastController, MenuController } from '@ionic/angular';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @ViewChild(IonSlides, { static: true }) slides: IonSlides;
  public userLogin: User = {};
  public userRegister: User = {};
  private loading: any;
  private usersSubscription: Subscription;

  isSignIn = true;
  actionChange = 'Criar Conta';


  constructor(
    private loadingController: LoadingController,
    private toast: ToastController,
    private authService: AuthService,
    private navCtrl: NavController,
    private menu: MenuController,
    //  public keyboard: Keyboard
  ) { }

  ngOnInit() { }

  async logout() {
    return await this.authService.logout();
  }

  async login() {
    await this.presentLoading();
    try {
      await this.authService.login( this.userLogin )
        .then((user) => {
          if (user) {
            console.log('login...', user);
            // this.authService.validateUser(user);
            this.navCtrl.navigateRoot('home');
          }
          console.log( user );
        });

    } catch ( error ) {
      let message: string;
      console.log( error );
      switch ( error.code ) {
        case 'auth/wrong-password':
          message = 'Email ou senha incorretos!';
          break;
        case 'auth/argument-error':
          message = 'Email ou senha não informados!';
          break;
        case 'auth/user-not-found':
          message = 'Usuário não registrado!';
          break;
      }
      this.presentToast(message);
    } finally {
      this.loading.dismiss();
    }
  }

  async register() {
    await this.presentLoading();
    try {
       await this.authService.register( this.userRegister )
      .then(( userRegistred ) => {

          this.usersSubscription = this.authService.getusers().subscribe( data => {
            /* unsubscribe() para não entrar em loop no addUserToNode() */
            this.usersSubscription.unsubscribe();

            this.userRegister.uid = userRegistred.user.uid;
            console.log('getusers(): ', data);
            if ( data ) {
              console.log('tem data...');
              if ( !this.authService.validateUser( this.userRegister, data ) ) {
                console.log('validação NOK...vai matar o cara');
                this.presentToast('CPF já cadastrado! Favor efetuar login!');
                this.slides.slidePrev();
                this.userRegister = {};
              } else {
                console.log('validação OK...');
                this.authService.addUserToNode(this.userRegister);
              }
            } else {
              console.log('não tem data...');
              this.authService.addUserToNode(this.userRegister);
            }
          });
      });

      } catch ( error ) {
      console.error( error );
      let message: string;
      switch ( error.code ) {
        case 'auth/email-already-in-use':
          message = 'Email já está sendo utilizado!';
          break;
        case 'auth/invalid-email':
          message = 'Email inválido!';
          break;
        case 'auth/weak-password':
          message = 'A senha deve ter ao menos 6 caracteres.';
          break;
      }
      this.presentToast(message);
    } finally {
      this.loading.dismiss();
    }
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Aguarde, por favor...'
    });
    return this.loading.present();
  }

  async presentToast(message: string) {
    const toast = await this.toast.create({
      message,
      duration: 2000
    });
    toast.present();
  }

  /* segmentChanged(event: any) {
    if (event.detail.value === 'login') {
      this.slides.slidePrev();
    } else {
      this.slides.slideNext();
    }
  }*/
  segmentChanged(event: any) {
    this.isSignIn = !this.isSignIn;
    this.actionChange = this.isSignIn ? 'Criar Conta' : 'Já sou cadastrado';
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter login page')
    this.menu.enable(false);
  }
}
