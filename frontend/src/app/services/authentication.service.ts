import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap, switchMap } from 'rxjs/operators';
import { BehaviorSubject, from, Observable, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	token = '';


  constructor(private httpclient: HttpClient) {

  }

  gettoken(){
   return localStorage.getItem('token');
  }

  login(credentials: { username:any ; password:any }): Observable<any> {
		return this.httpclient.post(`http://localhost:3000/api/auth/login`, credentials);
	}

  checkToken(){

  }

	logout() {
    localStorage.removeItem('x-token')
		/* return Storage.remove({ key: TOKEN_KEY }); */
	}
}


