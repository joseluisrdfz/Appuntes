import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Form } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private httpclient : HttpClient) { }

  registerUser(form: FormData): Observable<any> {
		return this.httpclient.post(`http://localhost:3000/api/users/register`,form);
	}

  getUserMyInfo(){

    return this.httpclient.get('http://localhost:3000/api/users/info',this.cabeceras);
  }

  getUserInfoId(id:any){
    return this.httpclient.get(`http://localhost:3000/api/users/info/${id}`,this.cabeceras);
  }

  getFeed(){
    return this.httpclient.get('http://localhost:3000/api/users/feed',this.cabeceras);
  }

  followUser(id:any){
    return this.httpclient.post(`http://localhost:3000/api/users/followUser/${id}`, '',this.cabeceras);
  }

  getBusqueda(busqueda:any){
    return this.httpclient.get(`http://localhost:3000/api/users/busqueda?query=${busqueda}`,this.cabeceras);
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
