import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AsignaturaService {

  constructor(private httpclient : HttpClient) { }

  getAsiganturasGradoCurso(gradoId : any, curso:any){
    return this.httpclient.get(`http://localhost:3000/api/asignaturas/grado/${gradoId}?curso=${curso}`);
  }

  getAsignaturaId(id:any){
    return this.httpclient.get(`http://localhost:3000/api/asignaturas/${id}`, this.cabeceras);
  }


  followAsig(id:any){
    return this.httpclient.post(`http://localhost:3000/api/asignaturas/followAsig/${id}`, '',this.cabeceras);
  }

  get cabeceras() {
    return {
      headers: {
        'x-token': this.token
      }};
  }

  get token(): string {
    return localStorage.getItem('x-token') || '';
  }
}
