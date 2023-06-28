import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Form } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class PreguntasService {

  constructor(private httpclient: HttpClient) { }

  postPreguntaApuntes(idApuntes : any , form : any){
    return this.httpclient.post(`http://localhost:3000/api/preguntas/apuntes/${idApuntes}/new`, form, this.cabeceras);
  }

  getPreguntaId(id : any){
    return this.httpclient.get(`http://localhost:3000/api/preguntas/${id}`, this.cabeceras);
  }

  postRespuestaOnPreguntaId(id :any, form : any){
    return this.httpclient.post(`http://localhost:3000/api/preguntas/${id}/respuestas/new`, form, this.cabeceras);
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
