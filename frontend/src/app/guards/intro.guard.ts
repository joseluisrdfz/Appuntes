import { Injectable } from '@angular/core';
import { Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage-angular';


export const INTRO_KEY = 'intro-seen';

@Injectable({
  providedIn: 'root'
})
export class IntroGuard{
  constructor (private router : Router,

    private storage: Storage){

  }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.check();
  }


  async check(){
   /* await this.storage.create()

    const hasSeenIntro = await this.storage.get(INTRO_KEY);
    if (hasSeenIntro && (hasSeenIntro === 'true')) {
      return true;
    } else {
      this.router.navigateByUrl('/intro', { replaceUrl:true });
      return false;
    }
  */

    return true;
  }
}
