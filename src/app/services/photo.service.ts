import { Injectable } from '@angular/core'
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
    providedIn: 'root'
})
export class PhotoService {
  //private file: File
  private fileName: string;

    constructor(
        private afStorage: AngularFireStorage,
    ) { }

    getPhotos(namePhoto, id: string) {
        return this.afStorage.ref(`photos/${id}/${namePhoto}`).getDownloadURL()
    }

    upLoadPhotos(id: string, blob: Blob) {
    /*  const ref = this.afStorage.ref(`${id}/${this.fileName}`)
        const task = ref.put(blob);
    */      
}
    
}