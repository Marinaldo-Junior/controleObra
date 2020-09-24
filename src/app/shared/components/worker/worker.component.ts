import { Component, OnInit, Input } from '@angular/core';

import { Worker } from '../../../interfaces/worker';
import { WorkerService } from '../../../services/worker.service';

@Component({
  selector: 'app-worker',
  templateUrl: './worker.component.html',
  styleUrls: ['./worker.component.scss']
})
export class WorkerComponent implements OnInit {

  public workers: Worker[];

  @Input() isCheckable: boolean; /* exibe lista com componente ion-checkbox */
  @Input() result: Worker[] = []; /* expõe resultado da selação */
  @Input() workRef: string ; /* recebe caminho da origem da coleção de workers */
  @Input() dailyRef: string; /* recebe caminho da origem da coleção de workers */
  
   constructor(
    private workerService: WorkerService
  ) {  }

  ngOnInit() { 
    //this.workerService.getAll().subscribe(data => this.workers = data);
    this.workRef === undefined ?
     this.workerService.getAll().subscribe(data => {this.workers = data})
     :this.workerService.getAllFrom(this.workRef, this.dailyRef)
        .subscribe(data => {
           if (data && data.length > 0) {
             console.log(data);
             this.workers = data;
           }
        })
  }

  /* controle os workers selecionados no componente e expõe para o utilizador do mesmo */
  onChange(worker: Worker, checked: boolean) {
    if (checked) {
      this.result.push(worker);
    } else {
      this.result.splice(this.result.indexOf(worker), 1);
    }
  }
 }
