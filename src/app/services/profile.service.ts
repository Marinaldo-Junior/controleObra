import { Profile } from './../interfaces/profile';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  /* instãncia tipada com de uma coleção de profiles */
  private profileCollection: AngularFirestoreCollection<Profile>;

  constructor(private afs: AngularFirestore) {
    /* Carga dos profiles armazenados no firestore. ('profile') é o nó que está sendo lido */
    this.profileCollection = afs.collection<Profile>('profile');
  }

  getAll() { 
    return this.profileCollection.snapshotChanges().pipe(
      /* action contém a coleção completa de profiles */
      map(actions => {
        /* "a" é cada profile encontrado na iteração */
        return actions.map(a => {
          const data = a.payload.doc.data();
          const uid = a.payload.doc.id;
          /* este retorno adiciona ao profile o "id" de onde ele está posicionado no nó.
            com isso, temos que tomar cuidado para não usar atributos "id" na definição de objetos no Firestore,
            pois serão sobrescritos. Analise no Firetore esta estrutura e imagine um atributo "id" irmão de description.*/
          return { uid, ...data };
        });
      })
    );
    }

  removeProfile(id: string) {
    return this.profileCollection.doc(id).delete();
  }

  updateprofile(id: string, profile: Profile) {
    console.log('tentando excluir profile', profile)
    return this.profileCollection.doc<Profile>(profile.uid).update(profile);
  }

  addProfile(profile: Profile) {
    return this.profileCollection.add(profile);
  }

  getProfile(id: string) {
    return this.profileCollection.doc<Profile>(id).valueChanges()
  }

  searchProfile(value: any[], text?: string) {
    return value.filter(current => {
        if (current.description && text) {
          if ( current.description.toLowerCase().indexOf(text.toLowerCase()) > -1) {
            return true;
          }
          return false;
        }
      });
  }

  
  
  /*filterProfile(text: string){
    const query = this.afs.collection<Profile>('profile', ref => ref.orderBy("description").startAt(text).endAt(text+'\uf8ff')).valueChanges();
    query.subscribe(valor => {
      console.log(valor);
    });
    
    
    //let query: firebase.firestore.CollectionReference | firebase.firestore.Query;
      //query = query.orderBy("description").startAt(text);
}*/
}
