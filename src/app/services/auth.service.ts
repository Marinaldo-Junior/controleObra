import { User } from '../interfaces/user';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userObservable: Observable<User[]>;
  private userCollection: AngularFirestoreCollection<User>;

  constructor(
    private afa: AngularFireAuth,
    private afm: AngularFirestore,
    private userFirestore: AngularFireAuth

  ) {
    this.userCollection = afm.collection<User>('users');
    this.userObservable = this.userCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getusers() {
    return this.userObservable;
  }

  login(user) {
    return this.afa.auth.signInWithEmailAndPassword(user.email, user.password);
  }

  register(user) {
    return this.afa.auth.createUserWithEmailAndPassword(user.email, user.password);
  }

  logout() {
    return this.afa.auth.signOut();
  }

  getAuth() {
    return this.afa.auth;
  }

  addUserToNode(user) {
    console.log('adicionando user...', user);
    delete user.password;
    user.actived = false;
    this.afm.collection('users').doc(user.uid).set(user);
  }

  removeUser() {
    this.userFirestore.auth.currentUser.delete();
  }

  public validateUser(userRegister, users: User[]): any {
    if (users) {
      users.forEach(user => {
        console.log('percorrendo o users...');
        console.log('user ', user);
        console.log('userRegister ', userRegister);
        if (user.cpf == userRegister.cpf) {
          console.log('CPF igual!');
          this.removeUser();
          this.logout();
          return false;
        }
      });
      return true;
    } else {
      return true;
    }
  }
}

/* prodcollection: AngularFirestore<Profile>;
profile = {} as Profile;

this.prodcollection = this.afs.collection('profiles').doc(`${data.uid}`).valueChanges();

this.prodcollection.subscribe(
  profile => this.profile = profile); */


/*   validateUser(userCretentials) {
    let any = this.afm.collection('users').doc(userCretentials.user.uid).get;
    console.log('exibindo any: ', any)
  }
 */
    //reescrever o validate como Observable
