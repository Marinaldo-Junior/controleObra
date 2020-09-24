import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

import { Worker } from 'src/app/interfaces/worker';
import { Team } from '../interfaces/team';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class TeamService {

  //private workerRefCollection: AngularFirestoreCollection<Worker>;
  private workerCollection: AngularFirestoreCollection<Worker>;

  private teamCollection: AngularFirestoreCollection<Team>;
  
  constructor(
    private afs: AngularFirestore,

  ) { 
    this.workerCollection = afs.collection<Worker>('worker');
    this.teamCollection = afs.collection<Team>('team');
  }


  getAll() {
    return this.teamCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map( a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  removeTeam( id: string) {
    return this.teamCollection.doc(id).delete();
  }

  updateTeam( id: string, team: Team ) {
    return this.teamCollection.doc(id).update(team);
  }

  addTeam( team: Team ) {
    return this.teamCollection.add(team);
  }

  getTeam( id: string) {
    return this.teamCollection.doc<Team>(id).valueChanges();
  }

  searchTeam(value: any[], text?: string) {
    return value.filter(current => {
        if (current.name && text) {
          if ( current.name.toLowerCase().indexOf(text.toLowerCase()) > -1) {
            return true;
          }
          return false;
        }
      });
  }
}
