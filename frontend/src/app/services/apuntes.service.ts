import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Form } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ApuntesService {

  constructor(private httpclient: HttpClient) { }

  postApuntes(form : Form){
    return this.httpclient.post(`http://localhost:3000/api/apuntes/new`, form, this.cabeceras);
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
