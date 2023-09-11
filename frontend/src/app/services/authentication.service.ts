import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap, switchMap } from 'rxjs/operators';
import { BehaviorSubject, from, Observable, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private httpclient: HttpClient) {

  }

  gettoken(){
   return localStorage.getItem('token');
  }

  login(credentials: { username:any ; password:any }): Observable<any> {
		return this.httpclient.post(`http://localhost:3000/api/auth/login`, credentials);
	}

  checkToken(){
    return this.httpclient.get(`http://localhost:3000/api/auth/renovar`, this.cabeceras);
  }

	logout() {
    localStorage.removeItem('x-token')
		/* return Storage.remove({ key: TOKEN_KEY }); */
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


