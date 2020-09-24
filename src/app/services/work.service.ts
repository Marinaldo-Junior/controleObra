import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Work } from '../interfaces/work';
import { Worker } from '../interfaces/worker';
import { Util } from '../shared/util';
import { PhotoService } from './photo.service';
import { WorkerService } from './worker.service';
import { EquipmentService } from './equipment.service'
import { Equipment } from '../interfaces/equipment';

@Injectable({
  providedIn: 'root'
})
export class WorkService {

  private workCollection: AngularFirestoreCollection<Work>;

  constructor(
     private afs: AngularFirestore,

  ) { 
    this.workCollection = afs.collection<Work>('work');
  }

  getAll() {
    return this.workCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data};
        });
      })
    );
  }

  removeWork(_id: string){
    return this.workCollection.doc(_id).delete();
  }

  updatework(_id: string, work: Work) {
    return this.workCollection.doc<Work>(_id).update(work);
  }

  addwork(work: Work) {
    return this.workCollection.add(work);
  }

  getWork(_id: string) {
    return this.workCollection.doc<Work>(_id).valueChanges();
  }

  searchWork(value: any[], text?: string) {
    return value.filter(current => {
        if (current.description && text || current.address && text) {
          if ( current.description.toLowerCase().indexOf(text.toLowerCase()) > -1
                || current.address.toLowerCase().indexOf(text.toLocaleLowerCase()) > -1) {
            return true;
          }
          return false;
        }
      });
  }

  saveWorkersOfWork(_id: string, workers: Worker[]) {
    workers.forEach(worker => {
      this.workCollection.doc(_id).collection(Util.TEAM).doc(worker.uid).set(worker)
        .then(result => console.log('Result: ', result))
        .catch(error => console.error('Error: ', error))
    });
  }

  saveEquipmentsOfWork(_id: string, equipments: Equipment[]) {
    equipments.forEach(equipment => {
      this.workCollection.doc(_id).collection(Util.EQUIPMENT).doc(equipment.uid).set(equipment)
        .then(result => console.log('Result: ', result))
        .catch(error => console.error('Error: ', error))
    });
  }

}
