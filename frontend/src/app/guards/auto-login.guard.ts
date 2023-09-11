import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';


@Injectable({
  providedIn: 'root'
})
export class AutoLoginGuard implements CanLoad {

  constructor (private authSrv : AuthenticationService , private router : Router){
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.check();
  }


  async check(){
    const userToken = await localStorage.getItem('x-token');
    if (userToken) {
      this.authSrv.checkToken().subscribe((res:any)=>{
        console.log('valido')
        this.router.navigateByUrl('/tabs/tabs/tab3', { replaceUrl:true });
      }, (err)=>{
        localStorage.removeItem('x-token')
      })

      return true
    } else {

      return true;
    }


  }
}
