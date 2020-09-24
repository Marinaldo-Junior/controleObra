import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import 'moment/locale/pt-br';
import { PopoverController, Events } from '@ionic/angular';

import { WorkService } from '../../services/work.service';
import { PhotoService } from '../../services/photo.service';
import { Work } from '../../interfaces/work';
import { Worker } from '../../interfaces/worker';
import { Daily } from '../../interfaces/daily';
import { DailyService } from 'src/app/services/daily.service';
import { Equipment } from 'src/app/interfaces/equipment';
import { OverlayService } from 'src/app/services/overlay.service';
import { SettingDetailComponent } from './setting-detail/setting-detail/setting-detail.component';


@Component({
  selector: 'app-work-detail',
  templateUrl: './work-detail.page.html',
  styleUrls: ['./work-detail.page.scss'],
  entryComponents: [SettingDetailComponent]
})

export class WorkDetailPage implements OnInit {

  @Input() team: Worker[] = [];
  @Input() equipments: Equipment[] = [];

  private dailySubscription: Subscription;
  private loading: any;
  public dailyCollection: Daily[];
  public work: Work;
  public urlPhotos: string[] = [];
  public canShowPhoto: boolean = false;
  public canShowTeam: boolean = false;
  public canShowEquipment: boolean = false;
  public showId: string = '';
  public labelBtnPhoto: string;
  public workRef: string;
  public canShowDetailOfWork: boolean = false;
  public controlDetBtn: string = 'Exibir det. obra';
  private popover;
  public canShowWorkerlOfWork: boolean = false;
  public canShowEquipmentslOfWork: boolean = false;


  constructor(
    private activatedRouter: ActivatedRoute,
    private workService: WorkService,
    private dailyService: DailyService,
    private photoservice: PhotoService,
    private overlayService: OverlayService,
    private popoverCtrl: PopoverController,
    public events: Events,
  ) { 
    events.subscribe('addWorkersOfWork', () => this.showWorkersOfwork())
    events.subscribe('addEquipmentsOfWork', () => this.showEquipmentsOfWork())
  }

  ngOnInit() {
    this.work = this.activatedRouter.snapshot.params;
    this.workRef = this.work.id;
    this.dailySubscription = this.dailyService.getDailyList(this.work.id)
      .subscribe(data => {
        data.sort((a, b) => (a.date > b.date ? 1 : -1))
        this.dailyCollection = data;
      })
  }

  async showSettings(ev: any) {
    this.popover = await this.popoverCtrl.create({
      component: SettingDetailComponent,
      event: ev,
      componentProps: { 'work': this.work },
      animated: true,
      showBackdrop: false
    });

    return await this.popover.present()
  }

  ngOnDestroy(): void {
    this.dailySubscription.unsubscribe();
    this.events.unsubscribe('addWorkersOfWork');
    this.events.unsubscribe('addEquipmentsOfWork');
  }

  /* Obtém a referencia dos nomes das fotos (array) que estão no NODE da daily */
  getReferencesPhoto(daily: Daily) {
    this.urlPhotos = [];
    this.dailyService.getReferencesPhoto(this.work.id, daily)
      .subscribe(photos => {
        if (photos) {
          Object.values(photos)
            .forEach(photoArray => {
              photoArray.forEach(photo => {
                this.photoservice.getPhotos(photo, daily.id).subscribe(
                  urlPhoto => {
                    this.urlPhotos.push(urlPhoto)
                  }
                )
              }
              )
            })
        }
      }
      )
  }

  showPhoto(_id: string) {
    this.canShowPhoto = !this.canShowPhoto;
    this.showId = _id;
    if (this.canShowPhoto) {
      this.canShowTeam = false;
      this.canShowEquipment = false;
    };
    return this.canShowPhoto;
  }

  showTeam(_id: string) {
    this.canShowTeam = !this.canShowTeam;
    this.showId = _id;
    if (this.canShowTeam) {
      this.canShowPhoto = false;
      this.canShowEquipment = false;
    };
    return this.canShowTeam;
  }

  showEquipments(_id: string) {
    this.canShowEquipment = !this.canShowEquipment;
    this.showId = _id;
    if (this.canShowEquipment) {
      this.canShowPhoto = false;
      this.canShowTeam = false;
    }
    return this.canShowEquipment;
  }

  async deleteDaily(workId: string, daily: Daily) {
    let data = new Date(daily.date.seconds * 1000);
    //FIXME - Ajustar formato da data para passar no dialogo de exclusão
    let novadata = moment(data.getDate(), 'DD/MM/YYYY')

    console.log('this.moment.date: ', novadata);

    const alert = await this.overlayService.alert({
      header: 'Confirmação',
      message: 'Excluir ' + novadata,
      buttons: [
        {
          text: 'Cancelar',
          role: 'Cancel',
          cssClass: 'secundary',
          handler: () => { }
        },
        {
          text: 'Ok',
          handler: async () => {
            this.loading = await this.overlayService.loading();
            try {

              this.dailyService.delete(workId, daily.id)
                .then(() => { console.log('Deleção com sucesso!') })
                .catch(error => { console.error(error) });

            } catch (error) {
              console.log(error)
            } finally {
              this.loading.dismiss();
              this.overlayService.toast({
                message: 'Diário excluído com sucesso.'
              });
            }
          }
        }
      ]
    });
    await alert.present();
  }

  showWorkersOfwork() {
    this.canShowWorkerlOfWork = !this.canShowWorkerlOfWork;
  }

  showEquipmentsOfWork() {
    this.canShowEquipmentslOfWork = !this.canShowEquipmentslOfWork;
  }

  saveWorkersOfWork(workId: string) {
    this.workService.saveWorkersOfWork(workId, this.team);
    this.showWorkersOfwork();
    this.overlayService.toast({
      message: 'Trabalhadores da obra cadastrados com sucesso.'
    });
  }

  saveEquipmentsOfWork(workId: string) {
    this.workService.saveEquipmentsOfWork(workId, this.equipments);
    this.showEquipmentsOfWork();
    this.overlayService.toast({
      message: 'Equipamentos da obra cadastrados com sucesso.'
    });
  }

  cancelWorkersOfWork() {
    this.showWorkersOfwork();
  }

  cancelEquipmentsOfWork() {
    this.showEquipmentsOfWork();
  }
}

