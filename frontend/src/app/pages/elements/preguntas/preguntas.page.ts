import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-preguntas',
  templateUrl: './preguntas.page.html',
  styleUrls: ['./preguntas.page.scss'],
})
export class PreguntasPage implements OnInit {
  previousUrl: string = '';
  currentUrl: string = '';
  constructor(private router: Router) {
    console.log(this.router.getCurrentNavigation())

  }

  ngOnInit() {
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
  ).subscribe((event:any) => {

    if(event.url.includes('/tabs/tabs/preguntas')){
      if(this.router.getCurrentNavigation()?.extras?.state != undefined){
        let aux : any = this.router.getCurrentNavigation()?.extras?.state
        if(aux['changePrev']==='yes')
        this.previousUrl = aux['prevUrl'];
      }
    }
  });


  }

  goBack(){
    this.router.navigateByUrl(this.previousUrl , {state: { prevUrl : "/tabs/tabs/preguntas", changePrev : 'no'}});
  }

}
