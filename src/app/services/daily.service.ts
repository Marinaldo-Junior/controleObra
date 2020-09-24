import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

import { Util } from '../shared/util';
import { Work } from '../interfaces/work';
import { Worker } from '../interfaces/worker';
import { Equipment } from '../interfaces/equipment';
import { Photo } from '../shared/photo';
import { Daily } from '../interfaces/daily';
import { PhotoService } from './photo.service';
import { WorkerService } from './worker.service';
import { EquipmentService } from './equipment.service';

@Injectable({
  providedIn: 'root'
})
export class DailyService {

  private workCollection: AngularFirestoreCollection<Work>;

  constructor(
    private afs: AngularFirestore,
    private photoService: PhotoService,
    private workerService: WorkerService,
    private equipmentService: EquipmentService,

  ) {
    this.workCollection = afs.collection<Work>('work');
  }

  save(work: Work, daily: Daily, photos?: Photo[], workers?: Worker[], equipments?: Equipment[]) {

    //work/KIGVNkO2Tv3o1QclnJ7d/daily/novo-hash-daily/team/reference

    let ref: AngularFirestoreCollection = this.afs.collection<Daily>(`work/${work.id}/${Util.DAILY}`);

    ref.add(daily)
      .then(dailyRef => {
        /* Salva os registros agregados, se houverem */

        if (workers.length > 0) {
          this.saveWorkersOfDay(ref, dailyRef.id, workers)
        }

        if (equipments.length > 0) {
          this.saveEquipmentsOfDay(ref, dailyRef.id, equipments);
        }
        /*
                if (photos.length > 0) {
                  this.savePhotosOfDay(ref, dailyRef.id, photos);
                }
         */
      })
      .catch(error => console.error(error))
  }

  delete(workId: string, dailyId: string) {
    return this.afs.collection(`work/${workId}/${Util.DAILY}`).doc(dailyId).delete();
  }


  private saveWorkersOfDay(ref: AngularFirestoreCollection, dailyRefId: string, workers: Worker[]) {
    workers.forEach(worker => {
      ref.doc(dailyRefId).collection(Util.TEAM).add(worker)
        .then(result => console.log('Result: ', result))
        .catch(error => console.error('ERROR: ', error));
    });
  }

  private saveEquipmentsOfDay(ref: AngularFirestoreCollection, dailyRefId: string, equipments: Equipment[]) {
    equipments.forEach(equipment => {
      ref.doc(dailyRefId).collection(Util.EQUIPMENT).add(equipment)
        .then(result => console.log('Result: ', result))
        .catch(error => console.error('ERROR: ', error));
    });
  }

  private savePhotosOfDay(ref: AngularFirestoreCollection, dailyRefId: string, photos: Photo[]) {
    /* registrar no STORAGE */
    photos.forEach(photo => {
      console.log(photo.name)
      ref.doc(dailyRefId).collection(Util.PHOTOS).add(photo)
        .then(result => console.log('Result: ', result))
        .catch(error => console.error('ERROR: ', error));
    });
  }

  /* Obtém a lista de tarefas (diário) */
  getDailyList(_id: string) {
    return this.workCollection.doc(_id).collection('daily').snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {

          let d: Daily = {
            id: a.payload.doc.id,
            date: a.payload.doc.data().date,
            description: a.payload.doc.data().description,
            ref: a.payload.doc.data().ref,
            urlPhotos: [],
            equipments: [],
            team: []
          }

          this.getReferencesPhoto(_id, d)
            .subscribe(photos => {
              if (photos) {
                Object.values(photos)
                  .forEach(photoArray => {
                    photoArray.forEach(photo => {
                      this.photoService.getPhotos(photo, d.id).subscribe(
                        urlPhoto => {
                          d.urlPhotos.push(urlPhoto)
                        }
                      )
                    }
                    )
                  })
              }
            })

            this.workerService.getAllFrom(_id, d.id).subscribe(
            result => {
              result.forEach(worker => {
                d.team.push(worker as Worker);
              })
            }
          )

          //;;this.equipmentService.getEquipmentAll().subscribe(
          this.equipmentService.getAllFrom(_id, d.id).subscribe(
            result => {
              result.forEach(equipment => {
                d.equipments.push(equipment as Equipment)

              });
            }
          )

          return d;
        });
      })
    );
  }

  /* Obtém a lista de trabalhadores */
  /*  getTeamList(_id: string) {
    return this.workCollection.doc(_id).collection('team').snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, ...data};
        });
      })
    );
  }
   */

  /* Obtém a lista de equipamentos */
  getEquipmentList(_id: string) {
    return this.workCollection.doc(_id).collection('equipment').snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return '';//this._transform(id, data);
        });
      })
    );
  }

  /* Obtém a referencia dos nomes das fotos (array) que estão no NODE da daily */
  getReferencesPhoto(_id: string, daily: Daily) {
    return this.workCollection
      .doc(_id)
      .collection(Util.DAILY)
      .doc(daily.id)
      .collection(Util.PHOTOS)
      .doc(Util.REFERENCE).valueChanges()
  }

}
