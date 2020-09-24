import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TeamService } from 'src/app/services/team.service';
import { Team } from 'src/app/interfaces/team';
import { WorkerService } from 'src/app/services/worker.service';
import { Worker } from 'src/app/interfaces/worker';

@Component({
  selector: 'app-checkbox-modal',
  templateUrl: './checkbox-modal.page.html',
  styleUrls: ['./checkbox-modal.page.scss'],
})
export class CheckboxModalPage implements OnInit {

  @Input() members: Worker[];
  @Input() membersLoaded: Worker[];
  @Input() title: string;

  public team: Team = {};

  member = [];

  private textSearch = ''

  constructor(
    private modalCtrl: ModalController,
    private teamService: TeamService,
    private workerService: WorkerService

  ) { }

  ngOnInit() {
  }

  cancel() {
    this.modalCtrl.dismiss({
      dismissed: true
    })
  }

  async save(){
    try {
      await this.teamService.addTeam(this.team);
      this.modalCtrl.dismiss({
        dismissed: true
      });
    } catch (error) {

    }
  }

  teste(a){
    if(a.isChecked == true){
      this.member.push(a);
    }else{
      let index = this.member.findIndex(b => b === a );
      this.member.splice(index, 1);
    }
    console.log(this.member);

    this.team.members = this.member;

    console.log(this.team);
  }

  search(event){
    this.initializeWorker();
    this.textSearch = event.target.value;
    if (!this.textSearch){ return }

    this.members = this.workerService.searchWorker(this.members, this.textSearch);
  }

  initializeWorker() {
    this.members = this.membersLoaded;
  }
}
