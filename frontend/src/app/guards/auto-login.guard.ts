import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AutoLoginGuard implements CanLoad {

  constructor (private router : Router){
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.check();
  }


  async check(){

    const userToken = await localStorage.getItem('x-token');

    if (userToken) {
      //comprobar token y si es valido poner que usuario es el del tken y dar al usuario la iopcion ed iniciar sesion o no
      //console.log(userToken);
      this.router.navigateByUrl('/tabs/tabs/tab3', { replaceUrl:true });
      return true;
    } else {

      return true;
    }


  }
}
