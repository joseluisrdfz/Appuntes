import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Route, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-apuntes',
  templateUrl: './apuntes.page.html',
  styleUrls: ['./apuntes.page.scss'],
})
export class ApuntesPage implements OnInit {

    previousUrl: string = '';
    currentUrl: string = '';

    id_apuntes = '';
    constructor(private router: Router, private route : ActivatedRoute) {
      console.log(this.router.getCurrentNavigation())

    }

    ngOnInit() {
      console.log('me inicio apunte')

      this.id_apuntes = this.route.snapshot.params['id'];

      this.router.events.pipe(
        filter((event) => event instanceof NavigationEnd)
    ).subscribe((event:any) => {

      if(event.url.includes('/tabs/tabs/apuntes')){
        if(this.router.getCurrentNavigation()?.extras?.state != undefined){
          let aux : any = this.router.getCurrentNavigation()?.extras?.state
          if(aux['changePrev']==='yes')
          this.previousUrl = aux['prevUrl'];
        }
      }
    });

    }



    goBack(){
      this.router.navigateByUrl(this.previousUrl, {state: { prevUrl : "/tabs/tabs/apuntes/", changePrev : 'no'}});
    }

    goto(url:any){
      console.log('goto'+url,  '   prevUrl:', "/tabs/tabs/apuntes" + this.id_apuntes)
      this.router.navigateByUrl('/tabs/tabs/preguntas/2',  {state: { prevUrl : "/tabs/tabs/apuntes/" + this.id_apuntes, changePrev : 'yes'}})

    }


}
