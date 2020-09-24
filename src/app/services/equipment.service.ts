import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Equipment } from '../interfaces/equipment';
import { map } from 'rxjs/operators';
import { Util } from '../shared/util';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {

  private equipmentCollection: AngularFirestoreCollection<Equipment>;

   constructor( private afs: AngularFirestore ) {
    this.equipmentCollection = afs.collection<Equipment>('equipment');
  }

   getAll() {
    return this.equipmentCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          let data = a.payload.doc.data();
          let dt = a.payload.doc.get('acquisitionDate').seconds * 1000;
          if (dt) { data.acquisitionDate = new Date(dt) }
          const uid = a.payload.doc.id;
          return { uid, ...data };
        });
      })
    );
  }

  getAllFrom(pathWork: string, dailyPath: string) {
    let ref = ""
    if (dailyPath) {
      ref = `work/${pathWork}/${Util.DAILY}/${dailyPath}/${Util.EQUIPMENT}`
    } else {
      ref = `work/${pathWork}/${Util.EQUIPMENT}`      
    }
      return this.afs.collection<Equipment>(ref).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a =>{
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }


  updateEquipment(id: string, equipment: Equipment) {
    return this.equipmentCollection.doc<Equipment>(id).update(equipment);
  }

  addEquipment(equipment: Equipment) {
    return this.equipmentCollection.add(equipment);
  }

  getEquipment(id: string) {
    return this.equipmentCollection.doc<Equipment>(id).valueChanges();
  }

  getEquipmentAll() {
    return this.equipmentCollection.valueChanges().pipe();
  }

  searchEquipment(value: any[], text?: string) {
    return value.filter(current => {
        if (current.description && text) {
          if ( current.description.toLowerCase().indexOf(text.toLowerCase()) > -1) {
            return true;
          }
          return false;
        }
      });
  }
}
