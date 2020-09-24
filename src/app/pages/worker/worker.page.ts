import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { ProfileService } from '../../services/profile.service';
import { Profile } from '../../interfaces/profile';
import { WorkerService } from '../../services/worker.service';
import { OverlayService } from '../../services/overlay.service';
import { Worker } from '../../interfaces/worker';

@Component({
  selector: 'app-worker',
  templateUrl: './worker.page.html',
  styleUrls: ['./worker.page.scss'],
})
export class WorkerPage implements OnInit {

  public workerId: string;
  private workerSubscription: Subscription;
  public worker: Worker = {};

  private profileId: string;
  public profilesCollections: Profile[];
  public profile: Profile;
  private profileSubscription: Subscription;

  action = 'Cadastro de Trabalhadores';

  constructor(
    private profileService: ProfileService,
    private activateRoute: ActivatedRoute,
    private service: WorkerService,
    private navCtrl: NavController,
    private overlayService: OverlayService
  ) {
    this.profileSubscription = this.profileService.getAll().subscribe(data =>
      this.profilesCollections = data);

    this.workerId = this.activateRoute.snapshot.params.id;

    if (this.workerId) {
      this.loadWorker();
    }
  }

  ngOnInit() {
    this.action = !this.workerId ? this.action : 'Alteração de Dados';
  }

  // tslint:disable-next-line: variable-name
  getIdProfile(_profile) {
    this.profilesCollections.filter((profile) => {
      return profile.description === _profile;
    }).map((result) => {
      this.worker.profile = result;
    });
  }


  loadWorker() {
    this.workerSubscription = this.service.getWorker(this.workerId).subscribe(data => {
      this.worker = data;
    });
  }

  async save() {
    this.getIdProfile(this.worker.profile);
    const loading = await this.overlayService.loading();
    if (this.workerId) {
      try {
        await this.service.updateWorker(this.workerId, this.worker);
        await this.updateProfileInUse(this.worker.profile.uid, this.worker.profile);
        this.navCtrl.navigateBack('/worker-list');
      } catch (error) {
        await this.overlayService.toast({
          message: 'Erro ao tentar salvar'
        });
      } finally {
        loading.dismiss();
      }
    } else {
      try {
        await this.service.addWorker(this.worker);
        await this.updateProfileInUse(this.worker.profile.uid, this.worker.profile);
        this.navCtrl.navigateBack('/worker-list');
      } catch (error) {
        await this.overlayService.toast({
          message: 'Erro ao tentar salvar: ' + error
        });
      } finally {
        loading.dismiss();
      }
    }
  }

  // Método para atualizar atributo inUse do componente Profile
  updateProfileInUse(id, inUse) {
    this.profileService.updateprofile(id, inUse);
  }

  cancel() {
    this.navCtrl.navigateBack('/worker-list');
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnDestroy() {
    if (this.workerSubscription) {
      this.workerSubscription.unsubscribe();
      this.profileSubscription.unsubscribe();
    }
  }

}
