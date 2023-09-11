import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {

  constructor (private authSrv : AuthenticationService , private router : Router){
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.check();
  }

  async check(){
    const userToken = await localStorage.getItem('x-token');
    var salida = true;
    if (userToken) {
      this.authSrv.checkToken().subscribe((res:any)=>{
        salida = true;
      }, (err)=>{
        this.router.navigateByUrl('/intro', { replaceUrl:true });
        salida = false;
      })
      //comprobar token y si es valido poner que usuario es el del tken y dar al usuario la iopcion ed iniciar sesion o no
      //console.log(userToken);
      console.log(salida)
      return salida
    } else {
      this.router.navigateByUrl('/intro', { replaceUrl:true });
      return false;
    }
  }
}
