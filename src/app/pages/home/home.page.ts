import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MenuController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  features: any;

  constructor(
    private authService: AuthService,
    private menu: MenuController,
    //private navCtrl: NavController,
    private route: Router,
    private http: HttpClient,
  ) { }

  ngOnInit() {
    this.http.get("/assets/dados/data.json")
    .subscribe(
      res => {
        this.features = res["features"]
      }
    )
 }

  // Logout temporário
  async logout() {
    console.log('saiu');
    return await this.authService.logout();
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter login page');
    this.menu.enable(true);
  }
  
  /* nextPage() {
    this.navCtrl.navigateForward('/work-list');
  }
 */

  goToDetailsView(feature) {
    console.log(feature.page)
    this.route.navigate([feature.page]);
  }

}
