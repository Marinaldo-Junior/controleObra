import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor() { }

  /*search(value: any[], text?: string) {
    return value.filter(current => {
        if (current && text) {
          if ( current.toLowerCase().indexOf(text.toLowerCase()) > -1) {
            return true;
          }
          return false;
        }
      });
  }*/
}
