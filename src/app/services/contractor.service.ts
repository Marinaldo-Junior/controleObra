import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';

import { Contractor } from '../interfaces/contractor';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ContractorService {

  private contractorCollection: AngularFirestoreCollection<Contractor>

  constructor(
    private afs: AngularFirestore
  ) { 
    this.contractorCollection = afs.collection<Contractor>('contractor');
  }

  getAll() {
    return this.contractorCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  removeContractor(id: string) {
    return this.contractorCollection.doc(id).delete();
  }

  updateContractor(id: string, contractor: Contractor) {
    return this.contractorCollection.doc(id).update(contractor);
  }

  addContractor(contractor: Contractor) {
    return this.contractorCollection.add(contractor);
  }

  getContractor(id: string) {
    return this.contractorCollection.doc<Contractor>(id).valueChanges();
  }
}
