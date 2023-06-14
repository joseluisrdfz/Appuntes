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
}
