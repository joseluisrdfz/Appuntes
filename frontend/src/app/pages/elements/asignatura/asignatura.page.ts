import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { PreguntasService } from 'src/app/services/preguntas.service';

@Component({
  selector: 'app-asignatura',
  templateUrl: './asignatura.page.html',
  styleUrls: ['./asignatura.page.scss'],
})
export class AsignaturaPage implements OnInit {
  previousUrl: string = '';
  currentUrl: string = '';

  routerSubs : Subscription | undefined = undefined;

  id_asig = '';

  constructor(private router: Router, private route : ActivatedRoute, private preguntasService : PreguntasService) {
    //console.log(this.router.getCurrentNavigation())

  }


  ngOnInit() {
    console.log('me inicio asig')


    this.id_asig = this.route.snapshot.params['id'];

    this.routerSubs = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
    ).subscribe((event:any) => {

      if(event.url.includes('/tabs/tabs/asignatura')){
      console.log(this.router.url)
      console.log('id asig : ', this.id_asig, ' id del router.url: ', this.router.url.split('/')[4] )
      if(this.router.url.split('/')[4] == this.id_asig){
        this.reload();
      }

      if(this.router.getCurrentNavigation()?.extras?.state != undefined){
        let aux : any = this.router.getCurrentNavigation()?.extras?.state
        if(aux['changePrev']==='yes')
        this.previousUrl = aux['prevUrl'];
      }
    }
  });

  }

  ngOnDestroy(){
    console.log('me voy de la asignatura', this.id_asig)
    this.routerSubs?.unsubscribe();
  }

  reload(){}

  goBack(){
    this.router.navigateByUrl(this.previousUrl , {state: { prevUrl : "/tabs/tabs/asignatura", changePrev : 'no'}});
  }


}
