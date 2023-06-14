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

    return this.httpclient.get('http://localhost:3000/api/users/myInfo',this.cabeceras);
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
