import { Component, OnInit } from '@angular/core';
import { Work } from 'src/app/interfaces/work';
import { Router } from '@angular/router';
import { NavParams, Events, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-setting-detail',
  templateUrl: './setting-detail.component.html',
  styleUrls: ['./setting-detail.component.scss'],
})
export class SettingDetailComponent implements OnInit {

  work: Work;

  constructor( 
    private router: Router,
    public navParams: NavParams,
    private events: Events,
    private popover: PopoverController

  ) { 
    this.work = this.navParams.get('work');
  }

  ngOnInit() {}

  addDaily() {
    this.router.navigate(['/daily', this.work]);
    this.popover.dismiss();
  }

  addWorkersOfWork() {
    this.events.publish('addWorkersOfWork');
    this.popover.dismiss();
  }
  
  addEquipmentsOfWork() {
    this.events.publish('addEquipmentsOfWork');
    this.popover.dismiss();
  }
}
