import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UniversitiesService {

  constructor(private httpclient : HttpClient) { }

  getUniversities(): Observable<any> {
		return this.httpclient.get(`http://localhost:3000/api/uni/`);
	}

  getUniId(id:any): Observable<any> {
		return this.httpclient.get(`http://localhost:3000/api/uni/${id}`);
	}
}
