import { Component, OnInit } from '@angular/core';
import { WorkerService } from 'src/app/services/worker.service';
import { Worker } from 'src/app/interfaces/worker';
import { Subscription } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { Team } from 'src/app/interfaces/team';
import { TeamService } from 'src/app/services/team.service';
import { OverlayService } from 'src/app/services/overlay.service';
import { CheckboxModalPage } from '../../shared/modals/checkbox-modal/checkbox-modal.page';

@Component({
  selector: 'app-team',
  templateUrl: './team.page.html',
  styleUrls: ['./team.page.scss'],
})
export class TeamPage implements OnInit {

  public workerCollection: Worker[];
  public workerLoadedCollection: Worker[];
  private workerSubscription: Subscription;

  teamCollection: Team[];
  teamLoadedCollection: Team[];
  
  private teamSubscription: Subscription;
  public team: Team = {};

  private textSearch = '';

  clicked: any;

  constructor(
    private workerService: WorkerService,
    private modalController: ModalController,
    private teamService: TeamService,
    private overlayService: OverlayService
  ) { 
    this.workerSubscription = this.workerService.getAll().subscribe(data => {
      this.workerCollection = data;
      this.workerLoadedCollection = data;
    });
    this.loadTeam();
  }

  ngOnInit() {
  }

  loadTeam(){
    this.teamSubscription = this.teamService.getAll().subscribe(data =>{
      this.teamCollection = data;
      this.teamLoadedCollection = data;
    });
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: CheckboxModalPage,
      componentProps: {
        members: this.workerCollection,
        membersLoaded: this.workerLoadedCollection,
        title: 'Cadastro de Equipes'
      }
    });
    return await modal.present();
  }

  async deleteTeam(team) {
    const alert = await this.overlayService.alert({
      header: 'Confirmação',
      message: 'Excluir ' + team.name,
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
            const loading = await this.overlayService.loading();
            try {
              this.teamService.removeTeam(team.id);
            } catch (error) {
              console.log(error);
            } finally {
              loading.dismiss();
              this.overlayService.toast({message: 'Equipe excluída com sucesso.'})
            }
          }
        }
      ]
    });
    await alert.present();
  }

  search(event){
    this.initializeTeam();
    this.textSearch = event.target.value;
    if (!this.textSearch){ return }

    this.teamCollection = this.teamService.searchTeam(this.teamCollection, this.textSearch);
  }

  initializeTeam() {
    this.teamCollection = this.teamLoadedCollection;
  }

  showMembers(a) {
    this.clicked = !this.clicked;
    console.log(a);
  }

  ngOnDestroy(): void {
    this.teamSubscription.unsubscribe();
    this.workerSubscription.unsubscribe();
  }
}
