import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';

import { Worker } from '../interfaces/worker';

import { map } from 'rxjs/operators';
import { Daily } from '../interfaces/daily';
import { Util } from '../shared/util';

@Injectable({
  providedIn: 'root'
})
export class WorkerService {
  
  private workerCollection: AngularFirestoreCollection<Worker>;

  constructor(
    private afs: AngularFirestore
  ) { 
    this.workerCollection = afs.collection<Worker>('worker');
  }

  getAll(){
    return this.workerCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a =>{
          const data = a.payload.doc.data();
          const uid = a.payload.doc.id;
          return { uid, ...data };
        });
      })
    );
  }

  getAllFrom(pathWork: string, dailyPath: string) {
    let ref = "";
    if (dailyPath) {
      ref = `work/${pathWork}/${Util.DAILY}/${dailyPath}/${Util.TEAM}`
    } else {
      ref = `work/${pathWork}/${Util.TEAM}`
    }
    return this.afs.collection<Worker>(ref).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a =>{
          const data = a.payload.doc.data();
          const uid = a.payload.doc.id;
          return { uid, ...data };
        });
      })
    );
  }

  removeWorker(id: string){
    return this.workerCollection.doc(id).delete();
  }

  updateWorker(id: string, worker: Worker) {
    return this.workerCollection.doc(id).update(worker);
  }

  addWorker(worker: Worker) {
    return this.workerCollection.add(worker);
  }

  getWorker(id: string) {
    return this.workerCollection.doc<Worker>(id).valueChanges();
  }

  //esse funciona
  getWorkerAll() {
    return this.workerCollection.valueChanges().pipe();
  }

  searchWorker(value: any[], text?: string) {
    return value.filter(current => {
        if (current.name && text || current.profile.description && text) {
          if ( current.name.toLowerCase().indexOf(text.toLowerCase()) > -1
                || current.profile.description.toLowerCase().indexOf(text.toLocaleLowerCase()) > -1) {
            return true;
          }
          return false;
        }
      });
  }
}
