import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GradosService {

  constructor(private httpclient : HttpClient) { }

  getGradosByUni(uni : any): Observable<any> {
		return this.httpclient.get(`http://localhost:3000/api/grado/uni/${uni}`);

	}

  getGradoId(id:any){
    return this.httpclient.get(`http://localhost:3000/api/grado/${id}`, this.cabeceras );
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
