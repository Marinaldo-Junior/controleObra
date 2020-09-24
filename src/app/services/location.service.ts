import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { EstadoBr } from './../interfaces/estado-br';
import { CidadesBr } from '../interfaces/cidades-br';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(
    private http: HttpClient
  ) { }

   getEstadosBr() {
    return this.http.get<EstadoBr[]>('assets/dados/estados-br.json');
  }

  getCidadesBr(idEstado) {
    return this.http.get<CidadesBr[]>('assets/dados/cidades-br.json')
    .pipe(
      map((cidades: CidadesBr[]) => cidades.filter(c => c.estado == idEstado))
    );
  }

  getCep(cep: string) {
    cep = cep.replace(/\D/g, '');
    // Verifica se campo cep possui valor informado.
    if (cep !== '') {
      // Expressão regular para validar o CEP.
      const validacep = /^[0-9]{8}$/;
      if (validacep.test(cep)) {
        // resetaFormCallback(formulario);

        return this.http
        .get(`//viacep.com.br/ws/${cep}/json`);
      }
    }
  }
}
